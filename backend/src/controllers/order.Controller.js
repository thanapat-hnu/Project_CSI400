import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";
import Payment from "../models/Payment.js"; // ✅ เพิ่มเข้ามา
import { sendAutoNotification } from "./notification.Controller.js";

/* ──────────────── GET ──────────────── */
// ดึงคำสั่งซื้อทั้งหมด (พร้อมชื่อสินค้า + การชำระเงิน)
export const getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price"],
            },
          ],
        },
        {
          model: Payment, // ✅ include การชำระเงิน
          as: "payments",
          attributes: ["id", "amount", "status", "paid_at"],
        },
      ],
      order: [["id", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "ไม่สามารถดึงคำสั่งซื้อได้" });
  }
};

// ดึงคำสั่งซื้อรายตัว (พร้อมชื่อสินค้า + การชำระเงิน)
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price"],
            },
          ],
        },
        {
          model: Payment,
          as: "payments",
          attributes: ["id", "amount", "status", "paid_at"],
        },
      ],
    });
    if (!order) return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "ไม่สามารถดึงคำสั่งซื้อได้" });
  }
};

/* ──────────────── CREATE ──────────────── */
// ✅ สร้างคำสั่งซื้อใหม่ (พร้อมคำนวณยอดรวม)
export const createOrder = async (req, res) => {
  const t = await Order.sequelize.transaction();
  try {
    const { user_id, items } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "กรุณาระบุสินค้าในคำสั่งซื้อ" });
    }

    // 🧮 คำนวณยอดรวม (รวมทุกชิ้น)
    const total_amount = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    // ✅ สร้าง order หลัก
    const order = await Order.create(
      { user_id, total_amount, status: "pending" },
      { transaction: t }
    );

    // ✅ เพิ่มรายการสินค้า
    await Promise.all(
      items.map((item) =>
        OrderItem.create(
          {
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          },
          { transaction: t }
        )
      )
    );

    await t.commit();

    // ✅ ดึงข้อมูลพร้อม items + product + payments
    const newOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price"],
            },
          ],
        },
        {
          model: Payment,
          as: "payments",
          attributes: ["id", "amount", "status", "paid_at"],
        },
      ],
    });

    res.status(201).json({
      message: "สร้างคำสั่งซื้อสำเร็จ",
      order: newOrder,
    });
  } catch (err) {
    await t.rollback();
    console.error("Error creating order:", err);
    res.status(400).json({ message: "ไม่สามารถสร้างคำสั่งซื้อได้" });
  }
};

/* ──────────────── UPDATE ──────────────── */
// ✅ อัปเดตสถานะคำสั่งซื้อ
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["pending", "paid", "shipped", "completed"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "สถานะไม่ถูกต้อง" });
    }

    const [updated] = await Order.update({ status }, { where: { id } });
    if (!updated) return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });

    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price"],
            },
          ],
        },
        {
          model: Payment,
          as: "payments",
          attributes: ["id", "amount", "status", "paid_at"],
        },
      ],
    });

    res.json({
      message: "อัปเดตสถานะคำสั่งซื้อสำเร็จ",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(400).json({ message: "ไม่สามารถอัปเดตคำสั่งซื้อได้" });
  }
};

/* ──────────────── DELETE ──────────────── */
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
    res.json({ message: "ลบคำสั่งซื้อสำเร็จ" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: "ไม่สามารถลบคำสั่งซื้อได้" });
  }
};

// ✅ ดึงคำสั่งซื้อของผู้ใช้แต่ละคน (ใช้กับฝั่ง User)
export const getOrdersByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const orders = await Order.findAll({
      where: { user_id },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price"],
            },
          ],
        },
        {
          model: Payment,
          as: "payments",
          attributes: ["id", "amount", "status", "paid_at"],
        },
      ],
      order: [["id", "DESC"]],
    });

    if (!orders.length) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อของผู้ใช้นี้" });
    }

    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลคำสั่งซื้อของผู้ใช้ได้" });
  }
};
