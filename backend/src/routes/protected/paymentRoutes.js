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
router.post("/", authJWT, createPayment);

export default router;
