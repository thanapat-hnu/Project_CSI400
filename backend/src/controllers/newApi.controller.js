import { pool } from "../config/dbpool.js";

// API: อัปเดต stock ของสินค้าจากคำสั่งซื้อล่าสุดของ user
export const updateStockFromLatestOrder = async (req, res) => {
  try {
    const userId = req.user.user_id;
    console.log("📌 เริ่มอัปเดต stock สำหรับ user_id:", userId);

    // 1️⃣ ดึงคำสั่งซื้อล่าสุดที่ status = 'paid'
    const [orders] = await pool.query(
      `SELECT id FROM orders WHERE user_id = ? AND status = 'paid' ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (orders.length === 0) {
      console.log("❌ ไม่พบคำสั่งซื้อล่าสุดสำหรับ user_id:", userId);
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อล่าสุด" });
    }

    const latestOrderId = orders[0].id;
    console.log("✅ คำสั่งซื้อล่าสุด id:", latestOrderId);

    // 2️⃣ ดึงรายการสินค้าของคำสั่งซื้อนั้น พร้อมชื่อ category
    const [items] = await pool.query(
      `
      SELECT 
        oi.product_id,
        oi.quantity,
        p.name AS product_name,
        p.stock AS old_stock,
        p.category_id,
        c.name AS category_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE oi.order_id = ?
      `,
      [latestOrderId]
    );

    if (items.length === 0) {
      console.log("❌ คำสั่งซื้อ id:", latestOrderId, "ไม่มีรายการสินค้า");
      return res.status(404).json({ message: "คำสั่งซื้อนี้ไม่มีรายการสินค้า" });
    }

    console.log("📦 รายการสินค้าที่จะอัปเดต:", items);

    const updatedProducts = [];

    // 3️⃣ อัปเดต stock ของแต่ละสินค้า
    for (const item of items) {
      if (!item.product_id) continue; // skip ถ้า product_id เป็น null

      const [result] = await pool.query(
        `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`,
        [item.quantity, item.product_id, item.quantity]
      );

      if (result.affectedRows === 0) {
        console.warn(`⚠️ สินค้า id=${item.product_id} (${item.product_name}) มี stock ไม่เพียงพอ`);
        updatedProducts.push({
          product_id: item.product_id,
          product_name: item.product_name,
          category_id: item.category_id,
          category_name: item.category_name,
          old_stock: item.old_stock,
          new_stock: item.old_stock, // stock ไม่เปลี่ยน
          note: "Stock ไม่เพียงพอ"
        });
      } else {
        const newStock = item.old_stock - item.quantity;
        console.log(`✅ อัปเดตสินค้า id=${item.product_id} (${item.product_name}): old_stock=${item.old_stock} → new_stock=${newStock}`);
        updatedProducts.push({
          product_id: item.product_id,
          product_name: item.product_name,
          category_id: item.category_id,
          category_name: item.category_name,
          old_stock: item.old_stock,
          new_stock: newStock
        });
      }
    }

    res.status(200).json({
      message: "อัปเดต stock สำเร็จ",
      order_id: latestOrderId,
      updatedProducts
    });
  } catch (err) {
    console.error("❌ updateStockFromLatestOrder Error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ", error: err.message });
  }
};
