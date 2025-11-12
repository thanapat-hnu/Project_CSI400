import express from 'express'
import { addToWishlist, getAllWishlist, removeFromWishlist } from '../../controllers/wishlistController.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: "API จัดการสินค้าที่ถูกใจ (ผู้จัดทำ: นายคฑาวุธ เมืองพรหม)"
 */

/**
 * @swagger
 * /api/protech/wishlist:
 *   post:
 *     summary: เพิ่มสินค้าลงใน Wishlist
 *     tags: [Wishlist]
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
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: รหัสสินค้าที่ต้องการเพิ่ม
 *     responses:
 *       201:
 *         description: เพิ่มสินค้าใน Wishlist สำเร็จ
 *       400:
 *         description: สินค้านี้อยู่ใน Wishlist แล้ว
 *       404:
 *         description: ไม่พบสินค้า
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.post('/', addToWishlist)

/**
 * @swagger
 * /api/protech/wishlist:
 *   get:
 *     summary: ดูรายการ Wishlist ของผู้ใช้
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงรายการ Wishlist สำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 user_id: 10
 *                 product:
 *                   id: 5
 *                   name: "สินค้าตัวอย่าง"
 *                   price: 500
 *                   images:
 *                     - url: "http://localhost:3000/uploads/products/sample.jpg"
 *       500:
 *         description: เกิดข้อผิดพลาดในการโหลด Wishlist
 */
router.get('/', getAllWishlist)

/**
 * @swagger
 * /api/protech/wishlist/{product_id}:
 *   delete:
 *     summary: ลบสินค้าจาก Wishlist
 *     tags: [Wishlist]
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
 *         description: ลบสินค้าออกจาก Wishlist สำเร็จ
 *       404:
 *         description: ไม่พบสินค้านี้ใน Wishlist
 *       500:
 *         description: เกิดข้อผิดพลาดในการลบสินค้า
 */
router.delete('/:product_id', removeFromWishlist)

export default router
