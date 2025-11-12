import express from "express";
import { authJWT } from "../../middlewares/auth.middleware.js";
import {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../controllers/cart.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ตะกร้า
 *   description: "API สำหรับจัดการตะกร้าสินค้าของผู้ใช้ (ผู้จัดทำ: นายธนภัทร หนูบุญมี)"
 */

/**
 * @swagger
 * /api/protech/cart:
 *   get:
 *     summary: ดึงตะกร้าของผู้ใช้
 *     tags: [ตะกร้า]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงข้อมูลตะกร้าสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               cart_id: 1
 *               items:
 *                 - product_id: 101
 *                   name: "สินค้า A"
 *                   description: "รายละเอียดสินค้า A"
 *                   quantity: 2
 *                   price: 150
 *                   total: 300
 *                   image_url: "https://example.com/image.jpg"
 *               total: 300
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/", authJWT, getMyCart);

/**
 * @swagger
 * /api/protech/cart/add:
 *   post:
 *     summary: เพิ่มสินค้าในตะกร้า
 *     tags: [ตะกร้า]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 101
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: เพิ่มสินค้าในตะกร้าเรียบร้อยแล้ว
 *       400:
 *         description: ข้อมูลไม่ครบหรือจำนวนสินค้าไม่ถูกต้อง
 *       404:
 *         description: ไม่พบสินค้า
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.post("/add", authJWT, addToCart);

/**
 * @swagger
 * /api/protech/cart/update:
 *   put:
 *     summary: อัปเดตจำนวนสินค้าในตะกร้า
 *     tags: [ตะกร้า]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 101
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: อัปเดตจำนวนสินค้าเรียบร้อยแล้ว
 *       400:
 *         description: ข้อมูลไม่ครบหรือจำนวนสินค้าไม่ถูกต้อง
 *       403:
 *         description: ไม่มีสิทธิ์แก้ไขรายการนี้
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.put("/update", authJWT, updateCartItem);

/**
 * @swagger
 * /api/protech/cart/remove/{product_id}:
 *   delete:
 *     summary: ลบสินค้ารายการเดียวออกจากตะกร้า
 *     tags: [ตะกร้า]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสสินค้าที่ต้องการลบ
 *     responses:
 *       200:
 *         description: ลบสินค้าออกจากตะกร้าเรียบร้อยแล้ว
 *       404:
 *         description: ไม่พบสินค้าในตะกร้า
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.delete("/remove/:product_id", authJWT, removeCartItem);

/**
 * @swagger
 * /api/protech/cart/clear:
 *   delete:
 *     summary: ล้างตะกร้าทั้งหมด
 *     tags: [ตะกร้า]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ล้างตะกร้าเรียบร้อยแล้ว
 *       404:
 *         description: ไม่พบตะกร้าของผู้ใช้
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.delete("/clear", authJWT, clearCart);

export default router;
