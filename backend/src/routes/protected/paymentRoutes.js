import express from "express";
import { getPaymentById, createPayment } from "../../controllers/payment.Controller.js";
import { authJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: การชำระเงิน
 *   description: "API สำหรับจัดการการชำระเงิน (ผู้จัดทำ: นายภูวนาท ศรุตติ์ตานนทร์)"
 */

/**
 * @swagger
 * /api/protech/payment/{id}:
 *   get:
 *     summary: ดูข้อมูลการชำระเงินของตัวเอง
 *     tags: [การชำระเงิน]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสการชำระเงิน
 *     responses:
 *       200:
 *         description: ดึงข้อมูลการชำระเงินสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               message: "ดึงข้อมูลการชำระเงินสำเร็จ"
 *               payment:
 *                 id: 1
 *                 order_id: 10
 *                 amount: 500
 *                 method: "credit_card"
 *                 status: "success"
 *                 paid_at: "2025-11-12T05:00:00.000Z"
 *       404:
 *         description: ไม่พบข้อมูลการชำระเงิน
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/:id", authJWT, getPaymentById);

/**
 * @swagger
 * /api/protech/payment:
 *   post:
 *     summary: สร้างการชำระเงินใหม่
 *     tags: [การชำระเงิน]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - amount
 *               - method
 *             properties:
 *               order_id:
 *                 type: integer
 *                 description: รหัสคำสั่งซื้อ
 *               amount:
 *                 type: number
 *                 description: จำนวนเงินที่ชำระ
 *               method:
 *                 type: string
 *                 description: วิธีการชำระเงิน
 *                 example: "credit_card"
 *               status:
 *                 type: string
 *                 description: สถานะการชำระเงิน (optional, default: "pending")
 *     responses:
 *       201:
 *         description: ชำระเงินสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               message: "✅ ชำระเงินสำเร็จ"
 *               payment:
 *                 id: 1
 *                 order_id: 10
 *                 amount: 500
 *                 method: "credit_card"
 *                 status: "success"
 *                 paid_at: "2025-11-12T05:00:00.000Z"
 *       400:
 *         description: ข้อมูลไม่ครบ, ยอดเงินไม่ถูกต้อง หรือชำระซ้ำ
 *       403:
 *         description: ผู้ใช้ไม่มีสิทธิ์ชำระเงินสำหรับคำสั่งซื้อ
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.post("/", authJWT, createPayment);

export default router;
