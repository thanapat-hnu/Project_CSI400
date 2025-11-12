import express from 'express'
import { createReview, getReviewsByProduct } from '../../controllers/reviewController.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: รีวิว
 *   description: "API สำหรับจัดการรีวิวสินค้า (ผู้จัดทำ: นายคฑาวุธ เมืองพรหม)"
 */

/**
 * @swagger
 * /api/protech/reviews:
 *   post:
 *     summary: เพิ่มรีวิวสินค้า
 *     tags: [รีวิว]
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
 *               - rating
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: รหัสสินค้า
 *               rating:
 *                 type: number
 *                 description: คะแนน 1-5
 *               comment:
 *                 type: string
 *                 description: ความเห็น (optional)
 *     responses:
 *       201:
 *         description: รีวิวสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               message: "รีวิวสำเร็จ ✅"
 *               review:
 *                 id: 1
 *                 product_id: 10
 *                 user_id: 5
 *                 rating: 5
 *                 comment: "สินค้าดีมาก"
 *       400:
 *         description: คะแนนไม่ถูกต้อง
 *       404:
 *         description: ไม่พบสินค้า
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.post('/', createReview);

/**
 * @swagger
 * /api/protech/reviews/{productId}:
 *   get:
 *     summary: ดูรีวิวของสินค้า
 *     tags: [รีวิว]
 *     security:
 *       - bearerAuth: []  
 * 
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสสินค้า
 *     responses:
 *       200:
 *         description: ดึงรีวิวสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 product_id: 10
 *                 user:
 *                   id: 5
 *                   username: "tanapat"
 *                 rating: 5
 *                 comment: "สินค้าดีมาก"
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get('/:productId', getReviewsByProduct);

export default router
