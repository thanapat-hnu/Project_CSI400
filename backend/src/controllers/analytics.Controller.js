import { Op, fn, col, literal } from "sequelize";
import Payment from "../models/Payment.js";
import Product from "../models/Product.js";

/* ──────────────── สรุปยอดขายรวม ──────────────── */
export const getTotalSales = async (_req, res) => {
  try {
    const result = await Payment.findAll({
      attributes: [
        [fn("SUM", col("amount")), "total_sales"],
        [fn("COUNT", col("id")), "total_payments"]
      ],
      where: { status: "success" },
      raw: true
    });

    res.json({
      total_sales: Number(result[0].total_sales || 0),
      total_payments: Number(result[0].total_payments || 0)
    });
  } catch (err) {
    console.error("Error fetching total sales:", err);
    res.status(500).json({ message: "ไม่สามารถดึงยอดขายรวมได้" });
  }
};

/* ──────────────── สรุปยอดขายรายวัน ──────────────── */
export const getDailySales = async (_req, res) => {
  try {
    const sales = await Payment.findAll({
      attributes: [
        [fn("DATE", col("paid_at")), "date"],
        [fn("SUM", col("amount")), "total_amount"]
      ],
      where: { status: "success" },
      group: [fn("DATE", col("paid_at"))],
      order: [[fn("DATE", col("paid_at")), "ASC"]],
      raw: true
    });

    res.json(sales);
  } catch (err) {
    console.error("Error fetching daily sales:", err);
    res.status(500).json({ message: "ไม่สามารถดึงยอดขายรายวันได้" });
  }
};

/* ──────────────── สินค้าขายดี ──────────────── */
export const getTopSellingProducts = async (_req, res) => {
  try {
    const topProducts = await OrderItem.findAll({
      attributes: [
        "product_id",
        [fn("SUM", col("quantity")), "total_sold"]
      ],
      group: ["product_id"],
      order: [[literal("total_sold"), "DESC"]],
      limit: 10,
      include: [
        { model: Product, as: "product", attributes: ["id", "name", "price"] }
      ],
      raw: true,
      nest: true
    });

    res.json(topProducts);
  } catch (err) {
    console.error("Error fetching top selling products:", err);
    res.status(500).json({ message: "ไม่สามารถดึงสินค้าขายดีได้" });
  }
};

/* ──────────────── รายงานสถานะออเดอร์ ──────────────── */
export const getOrderStatusSummary = async (_req, res) => {
  try {
    const statuses = await Order.findAll({
      attributes: [
        "status",
        [fn("COUNT", col("id")), "count"]
      ],
      group: ["status"],
      raw: true
    });

    res.json(statuses);
  } catch (err) {
    console.error("Error fetching order status summary:", err);
    res.status(500).json({ message: "ไม่สามารถดึงรายงานสถานะออเดอร์ได้" });
  }
};

/* ──────────────── รายงานยอดขายรายเดือน ──────────────── */
export const getMonthlySales = async (_req, res) => {
  try {
    const monthly = await Payment.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("paid_at"), "%Y-%m"), "month"],
        [fn("SUM", col("amount")), "total_sales"]
      ],
      where: { status: "success" },
      group: [fn("DATE_FORMAT", col("paid_at"), "%Y-%m")],
      order: [[literal("month"), "ASC"]],
      raw: true
    });

    res.json(monthly);
  } catch (err) {
    console.error("Error fetching monthly sales:", err);
    res.status(500).json({ message: "ไม่สามารถดึงยอดขายรายเดือนได้" });
  }
};
