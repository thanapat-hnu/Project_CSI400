import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

/* ──────────────── GET: All Payments ──────────────── */
export const getPayments = async (_req, res) => {
  try {
    const data = await Payment.findAll({
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id", "total_amount", "status", "created_at"],
        },
      ],
      order: [["id", "DESC"]],
    });
    res.json(data);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
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
          attributes: ["id", "total_amount", "status", "created_at"],
        },
      ],
    });

    if (!data) return res.status(404).json({ message: "Payment not found" });
    res.json(data);
  } catch (err) {
    console.error("Error fetching payment:", err);
    res.status(500).json({ message: "Failed to fetch payment" });
  }
};

/* ──────────────── POST: Create Payment ──────────────── */
export const createPayment = async (req, res) => {
  const t = await Payment.sequelize.transaction();
  try {
    const { order_id, amount, status = "pending" } = req.body;

    // ✅ ตรวจสอบว่ามี order จริงไหม
    const order = await Order.findByPk(order_id, { transaction: t });
    if (!order)
      return res.status(400).json({ message: "Invalid order_id: not found" });

    // ✅ ป้องกันการจ่ายซ้ำ (เช่นมีการชำระสำเร็จไปแล้ว)
    if (order.status === "paid" || order.status === "completed") {
      return res.status(400).json({
        message: "This order has already been paid or completed.",
      });
    }

    // ✅ ตรวจสอบยอดเงิน (optional)
    if (Number(amount) < Number(order.total_amount)) {
      return res.status(400).json({
        message: "Payment amount is less than order total amount.",
      });
    }

    // ✅ สร้าง payment record
    const newPayment = await Payment.create(
      {
        order_id,
        amount,
        status,
        paid_at: status === "success" ? new Date() : null,
      },
      { transaction: t }
    );

    // ✅ ถ้าชำระสำเร็จ → อัปเดตสถานะ Order เป็น "paid"
    if (status === "success") {
      await order.update({ status: "paid" }, { transaction: t });
    }

    await t.commit();

    res.status(201).json({
      message: "Payment created successfully",
      payment: newPayment,
    });
  } catch (err) {
    await t.rollback();
    console.error("Error creating payment:", err);
    res.status(500).json({ message: "Failed to create payment" });
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
      return res.status(404).json({ message: "Payment not found" });

    // ✅ ดึง order ที่เกี่ยวข้อง
    const order = await Order.findByPk(payment.order_id, { transaction: t });

    // ✅ อัปเดตข้อมูลการชำระเงิน
    payment.status = status || payment.status;
    payment.amount = amount || payment.amount;
    if (status === "success") payment.paid_at = new Date();
    await payment.save({ transaction: t });

    // ✅ ถ้าชำระสำเร็จ → อัปเดต order เป็น "paid"
    if (status === "success" && order) {
      await order.update({ status: "paid" }, { transaction: t });
    }

    await t.commit();

    res.json({
      message: "Payment updated successfully",
      payment,
    });
  } catch (err) {
    await t.rollback();
    console.error("Error updating payment:", err);
    res.status(500).json({ message: "Failed to update payment" });
  }
};

/* ──────────────── DELETE: Remove Payment ──────────────── */
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Payment.destroy({ where: { id } });

    if (!deleted)
      return res.status(404).json({ message: "Payment not found" });

    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error("Error deleting payment:", err);
    res.status(500).json({ message: "Failed to delete payment" });
  }
};
