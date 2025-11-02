import Refund from "../models/Refund.js";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js"; // ✅ เพิ่มบรรทัดนี้

/* ──────────────── GET ──────────────── */
// ดึงข้อมูลการคืนเงินทั้งหมด
export const getAllRefunds = async (_req, res) => {
  try {
    const refunds = await Refund.findAll({
      include: [
        { model: Order, as: "order", attributes: ["id", "user_id", "total_amount", "status"] },
        { model: Payment, as: "payment", attributes: ["id", "amount", "status"] },
      ],
      order: [["id", "DESC"]],
    });
    res.json(refunds);
  } catch (err) {
    console.error("Error fetching refunds:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลการคืนเงินได้" });
  }
};

/* ──────────────── GET by ID ──────────────── */
export const getRefundById = async (req, res) => {
  try {
    const { id } = req.params;
    const refund = await Refund.findByPk(id, {
      include: [
        { model: Order, as: "order", attributes: ["id", "user_id", "total_amount", "status"] },
        { model: Payment, as: "payment", attributes: ["id", "amount", "status"] },
      ],
    });

    if (!refund) return res.status(404).json({ message: "ไม่พบข้อมูลการคืนเงิน" });
    res.json(refund);
  } catch (err) {
    console.error("Error fetching refund:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลการคืนเงินได้" });
  }
};

/* ──────────────── CREATE ──────────────── */
export const createRefund = async (req, res) => {
  try {
    const { order_id, payment_id, user_id, reason, amount } = req.body;

    if (!order_id || !amount) {
      return res.status(400).json({ message: "กรุณาระบุ order_id และ amount" });
    }

    const refund = await Refund.create({
      order_id,
      payment_id: payment_id || null,
      user_id: user_id || null,
      reason: reason || "ไม่ระบุเหตุผล",
      amount,
      status: "requested",
    });

    res.status(201).json({ message: "ส่งคำขอคืนเงินสำเร็จ", refund });
  } catch (err) {
    console.error("Error creating refund:", err);
    res.status(400).json({ message: "ไม่สามารถสร้างคำขอคืนเงินได้" });
  }
};

/* ──────────────── UPDATE ──────────────── */
export const updateRefundStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["requested", "approved", "rejected", "refunded"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "สถานะไม่ถูกต้อง" });
    }

    const updateData = { status };
    if (status === "refunded") updateData.refunded_at = new Date();

    const [updated] = await Refund.update(updateData, { where: { id } });
    if (!updated) return res.status(404).json({ message: "ไม่พบข้อมูลการคืนเงิน" });

    const updatedRefund = await Refund.findByPk(id);
    res.json({ message: "อัปเดตสถานะการคืนเงินสำเร็จ", refund: updatedRefund });
  } catch (err) {
    console.error("Error updating refund:", err);
    res.status(400).json({ message: "ไม่สามารถอัปเดตสถานะได้" });
  }
};

/* ──────────────── DELETE ──────────────── */
export const deleteRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Refund.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: "ไม่พบข้อมูลการคืนเงิน" });
    res.json({ message: "ลบข้อมูลการคืนเงินเรียบร้อย" });
  } catch (err) {
    console.error("Error deleting refund:", err);
    res.status(500).json({ message: "ไม่สามารถลบข้อมูลการคืนเงินได้" });
  }
};
