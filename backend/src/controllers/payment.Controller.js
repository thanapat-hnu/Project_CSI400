import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

/* ──────────────── GET: All Payments (Admin) ──────────────── */
export const getPayments = async (_req, res) => {
  try {
    const data = await Payment.findAll({
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id", "user_id", "total_amount", "status", "created_at"],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      message: "ดึงข้อมูลการชำระเงินทั้งหมดสำเร็จ",
      count: data.length,
      payments: data,
    });
  } catch (err) {
    console.error("❌ Error fetching payments:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลการชำระเงินได้" });
  }
};

/* ──────────────── GET: Payment by ID ──────────────── */
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Payment.findByPk(id, {
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id", "user_id", "total_amount", "status", "created_at"],
        },
      ],
    });

    if (!data)
      return res.status(404).json({ message: "ไม่พบข้อมูลการชำระเงินนี้" });

    res.status(200).json({
      message: "ดึงข้อมูลการชำระเงินสำเร็จ",
      payment: data,
    });
  } catch (err) {
    console.error("❌ Error fetching payment:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลการชำระเงินได้" });
  }
};

/* ──────────────── POST: Create Payment ──────────────── */
export const createPayment = async (req, res) => {
  const t = await Payment.sequelize.transaction();
  try {
    const { order_id, amount, method, status = "pending" } = req.body;
    const user_id = req.user?.user_id || null; // ✅ ดึง user จาก token

    // ✅ ตรวจสอบว่ามี order จริงไหม
    const order = await Order.findByPk(order_id, { transaction: t });
    if (!order)
      return res.status(400).json({ message: "❌ ไม่พบคำสั่งซื้อในระบบ" });

    // ✅ ตรวจสอบสิทธิ์ผู้ใช้ (ห้ามจ่ายของคนอื่น)
    if (user_id && order.user_id && order.user_id !== user_id) {
      return res
        .status(403)
        .json({ message: "คุณไม่มีสิทธิ์ชำระเงินสำหรับคำสั่งซื้อนี้" });
    }

    // ✅ ป้องกันการชำระซ้ำ
    if (order.status === "paid" || order.status === "completed") {
      return res.status(400).json({ message: "คำสั่งซื้อนี้ได้ชำระเงินไปแล้ว" });
    }

    // ✅ ตรวจสอบยอดเงินต้องไม่น้อยกว่ายอดคำสั่งซื้อ
    if (Number(amount) < Number(order.total_amount)) {
      return res.status(400).json({
        message: `ยอดชำระ (${amount}) น้อยกว่ายอดคำสั่งซื้อ (${order.total_amount})`,
      });
    }

    // ✅ บันทึกการชำระเงิน
    const newPayment = await Payment.create(
      {
        order_id,
        amount,
        method,
        status,
        paid_at: status === "success" ? new Date() : null,
      },
      { transaction: t }
    );

    // ✅ อัปเดตสถานะคำสั่งซื้อ
    if (status === "success") {
      await order.update({ status: "paid" }, { transaction: t });
    }

    await t.commit();
    console.log(`💰 Payment created successfully for order #${order_id}`);

    res.status(201).json({
      message: "✅ ชำระเงินสำเร็จ",
      payment: newPayment,
    });
  } catch (err) {
    await t.rollback();
    console.error("❌ Error creating payment:", err);
    res.status(500).json({ message: "ไม่สามารถบันทึกข้อมูลการชำระเงินได้" });
  }
};

/* ──────────────── PUT: Update Payment ──────────────── */
export const updatePayment = async (req, res) => {
  const t = await Payment.sequelize.transaction();
  try {
    const { id } = req.params;
    const { status, amount } = req.body;

    const payment = await Payment.findByPk(id, { transaction: t });
    if (!payment)
      return res.status(404).json({ message: "ไม่พบข้อมูลการชำระเงิน" });

    const order = await Order.findByPk(payment.order_id, { transaction: t });

    // ✅ อัปเดตข้อมูลการชำระเงิน
    payment.status = status || payment.status;
    payment.amount = amount || payment.amount;
    if (status === "success") payment.paid_at = new Date();

    await payment.save({ transaction: t });

    // ✅ ถ้าชำระสำเร็จ → เปลี่ยนสถานะ order เป็น paid
    if (status === "success" && order) {
      await order.update({ status: "paid" }, { transaction: t });
    }

    await t.commit();
    res.json({
      message: "อัปเดตข้อมูลการชำระเงินสำเร็จ",
      payment,
    });
  } catch (err) {
    await t.rollback();
    console.error("❌ Error updating payment:", err);
    res.status(500).json({ message: "ไม่สามารถอัปเดตข้อมูลการชำระเงินได้" });
  }
};

/* ──────────────── DELETE: Remove Payment ──────────────── */
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Payment.destroy({ where: { id } });

    if (!deleted)
      return res.status(404).json({ message: "ไม่พบข้อมูลการชำระเงิน" });

    res.json({ message: "🗑️ ลบข้อมูลการชำระเงินสำเร็จ" });
  } catch (err) {
    console.error("❌ Error deleting payment:", err);
    res.status(500).json({ message: "ไม่สามารถลบข้อมูลการชำระเงินได้" });
  }
};
