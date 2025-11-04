import Refund from "../models/Refund.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import { sendAutoNotification } from "./notification.Controller.js";

/* ──────────────── GET ──────────────── */
// ดึงข้อมูลคำขอคืนเงินทั้งหมด
export const getAllRefunds = async (_req, res) => {
  try {
    const refunds = await Refund.findAll({
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id", "user_id", "status", "total_amount", "created_at"],
        },
        {
          model: Payment,
          as: "payment",
          attributes: ["id", "amount", "status", "paid_at"],
        },
      ],
      order: [["id", "DESC"]],
    });
    res.json(refunds);
  } catch (err) {
    console.error("Error fetching refunds:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลคำขอคืนเงินได้" });
  }
};

// ดึงคำขอคืนเงินตาม ID
export const getRefundById = async (req, res) => {
  try {
    const { id } = req.params;
    const refund = await Refund.findByPk(id, {
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id", "user_id", "status", "total_amount", "created_at"],
        },
        {
          model: Payment,
          as: "payment",
          attributes: ["id", "amount", "status", "paid_at"],
        },
      ],
    });

    if (!refund)
      return res.status(404).json({ message: "ไม่พบข้อมูลคำขอคืนเงิน" });

    res.json(refund);
  } catch (err) {
    console.error("Error fetching refund:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลคำขอคืนเงินได้" });
  }
};

/* ──────────────── CREATE ──────────────── */
// ✅ สร้างคำขอคืนเงิน (พร้อมแจ้งเตือน)
export const createRefund = async (req, res) => {
  const t = await Refund.sequelize.transaction();
  try {
    const { order_id, payment_id, user_id, reason, amount } = req.body;

    if (!order_id || !amount) {
      return res.status(400).json({ message: "กรุณาระบุ order_id และ amount" });
    }

    const order = await Order.findByPk(order_id, { transaction: t });
    if (!order)
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อที่ระบุ" });

    const payment = payment_id
      ? await Payment.findByPk(payment_id, { transaction: t })
      : null;

    const existingRefund = await Refund.findOne({
      where: { order_id },
      transaction: t,
    });
    if (existingRefund)
      return res.status(400).json({ message: "มีคำขอคืนเงินของออเดอร์นี้อยู่แล้ว" });

    const refund = await Refund.create(
      {
        order_id,
        payment_id: payment_id || null,
        user_id: user_id || order.user_id || null,
        reason: reason || "ไม่ระบุเหตุผล",
        amount,
        status: "requested",
      },
      { transaction: t }
    );

    await order.update({ status: "refund_requested" }, { transaction: t });
    await t.commit();

    // ✅ แจ้งเตือนผู้ใช้ว่ามีการส่งคำขอคืนเงิน
    await sendAutoNotification(order.user_id, "refund", order.id, "คำขอคืนเงินของคุณอยู่ระหว่างการตรวจสอบ");

    res.status(201).json({
      message: "ส่งคำขอคืนเงินสำเร็จ",
      refund,
    });
  } catch (err) {
    await t.rollback();
    console.error("Error creating refund:", err);
    res.status(400).json({ message: "ไม่สามารถสร้างคำขอคืนเงินได้" });
  }
};

/* ──────────────── UPDATE ──────────────── */
// ✅ อัปเดตสถานะคำขอคืนเงิน (พร้อมแจ้งเตือน)
export const updateRefundStatus = async (req, res) => {
  const t = await Refund.sequelize.transaction();
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["requested", "approved", "rejected", "completed"];
    if (!validStatus.includes(status))
      return res.status(400).json({ message: "สถานะไม่ถูกต้อง" });

    const refund = await Refund.findByPk(id, { transaction: t });
    if (!refund)
      return res.status(404).json({ message: "ไม่พบคำขอคืนเงิน" });

    refund.status = status;
    if (status === "completed") refund.refunded_at = new Date();
    await refund.save({ transaction: t });

    const order = await Order.findByPk(refund.order_id, { transaction: t });
    if (order) {
      if (status === "approved") {
        await order.update({ status: "refunding" }, { transaction: t });
        await sendAutoNotification(order.user_id, "refund", order.id, "คำขอคืนเงินของคุณได้รับการอนุมัติแล้ว");
      } else if (status === "completed") {
        await order.update({ status: "refunded" }, { transaction: t });
        await sendAutoNotification(order.user_id, "refund", order.id, "ระบบได้คืนเงินให้คุณเรียบร้อยแล้ว 💸");
      } else if (status === "rejected") {
        await order.update({ status: "completed" }, { transaction: t });
        await sendAutoNotification(order.user_id, "refund", order.id, "คำขอคืนเงินของคุณถูกปฏิเสธ ❌");
      }
    }

    await t.commit();

    res.json({
      message: "อัปเดตสถานะคำขอคืนเงินสำเร็จ",
      refund,
    });
  } catch (err) {
    await t.rollback();
    console.error("Error updating refund:", err);
    res.status(400).json({ message: "ไม่สามารถอัปเดตคำขอคืนเงินได้" });
  }
};

/* ──────────────── DELETE ──────────────── */
// ✅ ลบคำขอคืนเงิน (พร้อมแจ้งเตือน)
export const deleteRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const refund = await Refund.findByPk(id, {
      include: [{ model: Order, as: "order", attributes: ["id", "user_id"] }],
    });

    if (!refund)
      return res.status(404).json({ message: "ไม่พบคำขอคืนเงิน" });

    await refund.destroy();

    // ✅ แจ้งเตือนผู้ใช้เมื่อคำขอคืนเงินถูกลบ
    if (refund.order && refund.order.user_id) {
      await sendAutoNotification(
        refund.order.user_id,
        "refund",
        refund.order.id,
        "คำขอคืนเงินของคุณถูกยกเลิก"
      );
    }

    res.json({ message: "ลบคำขอคืนเงินสำเร็จ" });
  } catch (err) {
    console.error("Error deleting refund:", err);
    res.status(500).json({ message: "ไม่สามารถลบคำขอคืนเงินได้" });
  }
};
