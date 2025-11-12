import { pool } from '../config/dbpool.js';

/* ──────────────── ฟังก์ชันตรวจหรือสร้างตะกร้า ──────────────── */
export const getOrCreateCart = async (userId) => {
  const [cart] = await pool.query(
    `SELECT * FROM carts WHERE user_id = ?`, [userId]
  );

  if (cart.length > 0) return cart[0];

  const [result] = await pool.query(
    `INSERT INTO carts (user_id) VALUES (?)`, [userId]
  );

  return { id: result.insertId };
};

/* ──────────────── ดึงข้อมูลตะกร้า ──────────────── */
export const getMyCart = async (req, res) => {
  try {
    const userId = req.user.user_id;
    console.log(userId)
    const cart = await getOrCreateCart(userId);

    const [items] = await pool.query(
      `
      SELECT 
        ci.product_id, 
        ci.quantity, 
        ci.price,
        (ci.quantity * ci.price) AS total,
        p.name, 
        p.description,
        (
          SELECT pi.url
          FROM product_images pi
          WHERE pi.product_id = p.id
          ORDER BY pi.id ASC
          LIMIT 1
        ) AS image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
      `,
      [cart.id]
    );

    const total = items.reduce((sum, i) => sum + Number(i.total), 0);

    return res.status(200).json({
      userId,
      cart_id: cart.id,
      items,
      total,
    });
  } catch (err) {
    console.error("❌ getMyCart Error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
};


/* ──────────────── เพิ่มสินค้า ──────────────── */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.user_id;
    let { product_id, quantity } = req.body;

    // 🛑 กันกรณีที่ front ส่ง object มาแทน id
    if (typeof product_id === "object" && product_id.id) {
      product_id = product_id.id;
    }

    if (!product_id || !quantity) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
    }

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "จำนวนสินค้าไม่ถูกต้อง" });
    }

    // ✅ ตรวจว่าสินค้ามีอยู่จริง
    const [product] = await pool.query(
      `SELECT id, price FROM products WHERE id = ? LIMIT 1`, [product_id]
    );

    if (product.length === 0) {
      return res.status(404).json({ message: "ไม่พบสินค้าในระบบ" });
    }

    const item = product[0];
    const cart = await getOrCreateCart(userId);

    // ✅ เพิ่มสินค้าหรืออัปเดตจำนวน
    await pool.query(
      `
      INSERT INTO cart_items (cart_id, product_id, quantity, price)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
      `,
      [cart.id, item.id, quantity, item.price]
    );

    res.status(200).json({ message: "เพิ่มสินค้าในตะกร้าแล้ว" });
  } catch (err) {
    console.error("❌ addToCart Error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
};

/* ──────────────── อัปเดตจำนวน ──────────────── */
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity)
      return res.status(400).json({ message: "ข้อมูลไม่ครบ" });

    if (isNaN(quantity) || quantity <= 0)
      return res.status(400).json({ message: "จำนวนสินค้าไม่ถูกต้อง" });

    // ✅ ตรวจสอบสิทธิ์
    const [item] = await pool.query(
      `
      SELECT ci.product_id 
      FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      WHERE ci.product_id = ? AND c.user_id = ?
      `,
      [product_id, userId]
    );

    if (item.length === 0)
      return res.status(403).json({ message: "ไม่มีสิทธิ์แก้รายการนี้" });

    await pool.query(
      `UPDATE cart_items SET quantity = ? WHERE product_id = ?`,
      [quantity, product_id]
    );

    return res.status(200).json({ message: "อัปเดตจำนวนสินค้าแล้ว" });
  } catch (err) {
    console.error("❌ updateCartItem Error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
};

/* ──────────────── ลบสินค้า ──────────────── */
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { product_id } = req.params;

    const [cart] = await pool.query(
      `SELECT id FROM carts WHERE user_id = ?`, [userId]
    );

    if (cart.length === 0)
      return res.status(404).json({ message: "ไม่พบตะกร้าของคุณ" });

    const cartId = cart[0].id;

    const [result] = await pool.query(
      `DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?`,
      [cartId, product_id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "ไม่พบสินค้านี้ในตะกร้า" });

    res.status(200).json({ message: "ลบสินค้าออกจากตะกร้าแล้ว" });
  } catch (err) {
    console.error("❌ removeCartItem Error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
};

/* ──────────────── ล้างตะกร้า ──────────────── */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [cart] = await pool.query(
      `SELECT id FROM carts WHERE user_id = ? LIMIT 1`, [userId]
    );

    if (cart.length === 0)
      return res.status(404).json({ message: "ไม่พบตะกร้าของคุณ" });

    const cartId = cart[0].id;

    await pool.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cartId]);

    res.status(200).json({ message: "ล้างตะกร้าเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("❌ clearCart Error:", err);
    res.status(500).json({ message: "ไม่สามารถล้างตะกร้าได้" });
  }
};
