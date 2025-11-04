import express from "express";
import multer from "multer";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,
  addProductImage,
  deleteProductImage,
} from "../../controllers/product.Controller.js";

import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import ProductVariant from "../../models/ProductVariant.js";
import ProductImage from "../../models/ProductImage.js";

const router = express.Router();

/* ──────────────── ตั้งค่า Multer สำหรับอัปโหลดรูป ──────────────── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products/"); // 📁 เก็บในโฟลเดอร์นี้
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

/* ──────────────── Product ──────────────── */
router.post("/", upload.single("image"), createProduct);

router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

/* ──────────────── Variant ──────────────── */
router.post("/:id/variants", addProductVariant);
router.put("/variants/:variantId", updateProductVariant);
router.delete("/variants/:variantId", deleteProductVariant);

/* ──────────────── Image ──────────────── */
// ✅ ใช้ upload.single('image') เพื่ออัปโหลดไฟล์จริง
router.post("/:id/images", upload.single("image"), addProductImage);
router.delete("/images/:imageId", deleteProductImage);

/* ──────────────── Get Products ──────────────── */
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: ProductVariant, as: "variants" },
        { model: ProductImage, as: "images" },
      ],
      order: [["id", "ASC"]],
    });

    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า" });
  }
});

export default router;
