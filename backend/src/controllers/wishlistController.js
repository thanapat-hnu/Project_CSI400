import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import ProductImage from "../models/ProductImage.js";

/* ──────────────── เพิ่มสินค้าใน Wishlist ──────────────── */
export const addToWishlist = async (req, res) => {
  try {
    const user_id = req.user.id || req.user.user_id; 
    const { product_id } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: "ไม่พบสินค้า" });

    const existing = await Wishlist.findOne({ where: { user_id, product_id } });
    if (existing)
      return res
        .status(400)
        .json({ message: "สินค้านี้อยู่ใน Wishlist แล้ว" });

    const wishlistItem = await Wishlist.create({ user_id, product_id });
    res.status(201).json({ message: "เพิ่มใน Wishlist สำเร็จ ✅", wishlistItem });
  } catch (err) {
    console.error("❌ Error adding to wishlist:", err);
    res.status(500).json({ message: "ไม่สามารถเพิ่มสินค้าได้" });
  }
};

/* ──────────────── ดูรายการ Wishlist ──────────────── */
export const getAllWishlist = async (req, res) => {
  try {
    const user_id = req.user.id || req.user.user_id; 

    const wishlists = await Wishlist.findAll({
      where: { user_id },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price"],
          include: [
            {
              model: ProductImage,
              as: "images",
              attributes: ["url"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // ✅ ต่อ URL เต็ม
    const fullWishlist = wishlists.map((item) => {
      const json = item.toJSON();
      if (json.product?.images?.length > 0) {
        json.product.images = json.product.images.map((img) => ({
          url: img.url.startsWith("http")
            ? img.url
            : `http://localhost:3000${img.url}`,
        }));
      }
      return json;
    });

    res.json(fullWishlist);
  } catch (err) {
    console.error("❌ Error fetching wishlist:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการโหลดสินค้าที่ถูกใจ" });
  }
};


/* ──────────────── ลบสินค้าออกจาก Wishlist ──────────────── */
export const removeFromWishlist = async (req, res) => {
  try {
    const user_id = req.user.id || req.user.user_id; 
    const { product_id } = req.params;

    const deleted = await Wishlist.destroy({
      where: { user_id, product_id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "ไม่พบสินค้านี้ใน Wishlist" });
    }

    res.json({ message: "ลบสินค้าออกจาก Wishlist สำเร็จ ✅" });
  } catch (err) {
    console.error("❌ Error removing wishlist:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบสินค้า" });
  }
};

