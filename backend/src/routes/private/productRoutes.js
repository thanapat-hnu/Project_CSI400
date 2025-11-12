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
  getAllProducts,
  getProductById,
  searchProducts,
} from "../../controllers/product.Controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: สินค้า
 *   description: "API สำหรับจัดการสินค้า (ผู้จัดทำ: นายคฑาวุธ เมืองพรหม)"
 */

/* ──────────────── Multer Upload ──────────────── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/products/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/**
 * @swagger
 * /api/private/product:
 *   get:
 *     summary: ดึงสินค้าทั้งหมด
 *     tags: [สินค้า]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงสินค้าสำเร็จ
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/private/product/search:
 *   get:
 *     summary: ค้นหาสินค้า
 *     tags: [สินค้า]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: q
 *         in: query
 *         description: คำค้นหา
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ผลการค้นหา
 */
router.get("/search", searchProducts);

/**
 * @swagger
 * /api/private/product/{id}:
 *   get:
 *     summary: ดึงสินค้าตาม ID
 *     tags: [สินค้า]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID ของสินค้า
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: ดึงสินค้าเรียบร้อย
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/private/product:
 *   post:
 *     summary: เพิ่มสินค้าใหม่
 *     tags: [สินค้า]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               category_id:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: เพิ่มสินค้าสำเร็จ
 */
router.post("/", upload.single("image"), createProduct);

/**
 * @swagger
 * /api/private/product/{id}:
 *   put:
 *     summary: อัปเดตสินค้า
 *     tags: [สินค้า]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: อัปเดตสินค้าเรียบร้อย
 */
router.put("/:id", updateProduct);

/**
 * @swagger
 * /api/private/product/{id}:
 *   delete:
 *     summary: ลบสินค้า
 *     tags: [สินค้า]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: ลบสินค้าเรียบร้อย
 */
router.delete("/:id", deleteProduct);

/**
 * @swagger
 * /api/private/product/{id}/variants:
 *   post:
 *     summary: เพิ่ม Variant ของสินค้า
 *     tags: [สินค้า]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: เพิ่ม Variant สำเร็จ
 */
router.post("/:id/variants", addProductVariant);

/**
 * @swagger
 * /api/private/product/variants/{variantId}:
 *   put:
 *     summary: อัปเดต Variant
 *     tags: [สินค้า]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: variantId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: อัปเดต Variant สำเร็จ
 */
router.put("/variants/:variantId", updateProductVariant);

/**
 * @swagger
 * /api/private/product/variants/{variantId}:
 *   delete:
 *     summary: ลบ Variant
 *     tags: [สินค้า]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: variantId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: ลบ Variant สำเร็จ
 */
router.delete("/variants/:variantId", deleteProductVariant);

/**
 * @swagger
 * /api/private/product/{id}/images:
 *   post:
 *     summary: เพิ่มรูปภาพสินค้า
 *     tags: [สินค้า]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: เพิ่มรูปภาพสำเร็จ
 */
router.post("/:id/images", upload.single("image"), addProductImage);

/**
 * @swagger
 * /api/private/product/images/{imageId}:
 *   delete:
 *     summary: ลบรูปภาพสินค้า
 *     tags: [สินค้า]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: imageId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: ลบรูปภาพสำเร็จ
 */
router.delete("/images/:imageId", deleteProductImage);

export default router;
