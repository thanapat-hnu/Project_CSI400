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
  try {
    const { order_id, amount, status = "pending" } = req.body;

    // ตรวจสอบ order_id ว่ามีอยู่จริงไหม
    const order = await Order.findByPk(order_id);
    if (!order)
      return res.status(400).json({ message: "Invalid order_id: not found" });

    const newPayment = await Payment.create({
      order_id,
      amount,
      status,
      paid_at: status === "success" ? new Date() : null,
    });

    res.status(201).json({
      message: "Payment created successfully",
      payment: newPayment,
    });
  } catch (err) {
    console.error("Error creating payment:", err);
    res.status(500).json({ message: "Failed to create payment" });
  }
};

/* ──────────────── PUT: Update Payment ──────────────── */
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, amount } = req.body;

    const payment = await Payment.findByPk(id);
    if (!payment)
      return res.status(404).json({ message: "Payment not found" });

    // อัปเดตค่า
    payment.status = status || payment.status;
    payment.amount = amount || payment.amount;
    if (status === "success") payment.paid_at = new Date();

    await payment.save();

    res.json({ message: "Payment updated successfully", payment });
  } catch (err) {
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
