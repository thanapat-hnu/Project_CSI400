import express from "express";
import {
  getRefundById,
  createRefund,
} from "../../controllers/refund.Controller.js";
import { authJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ──────────────── USER ──────────────── */

/**
 * @swagger
 * tags:
 *   name: คืนเงิน
 *   description: "API สำหรับจัดการคำขอคืนเงิน (ผู้จัดทำ: นายภูวนาท ศรุตติ์ตานนทร์)"
 */

/**
 * @swagger
 * /api/protech/refund/{id}:
 *   get:
 *     summary: ดูข้อมูลคำขอคืนเงินของตัวเอง
 *     tags: [คืนเงิน]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสคำขอคืนเงิน
 *     responses:
 *       200:
 *         description: ดึงข้อมูลคำขอคืนเงินสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               message: "ดึงข้อมูลคำขอคืนเงินสำเร็จ"
 *               refund:
 *                 id: 1
 *                 order_id: 10
 *                 amount: 500
 *                 status: "requested"
 *                 refunded_at: null
 *       404:
 *         description: ไม่พบคำขอคืนเงิน
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/:id", authJWT, getRefundById);

/**
 * @swagger
 * /api/protech/refund:
 *   post:
 *     summary: ส่งคำขอคืนเงิน
 *     tags: [คืนเงิน]
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
 *             properties:
 *               order_id:
 *                 type: integer
 *                 description: รหัสคำสั่งซื้อ
 *               payment_id:
 *                 type: integer
 *                 description: รหัสการชำระเงิน (optional)
 *               user_id:
 *                 type: integer
 *                 description: รหัสผู้ใช้ (optional, ดึงจาก token)
 *               amount:
 *                 type: number
 *                 description: จำนวนเงินที่ต้องการคืน
 *               reason:
 *                 type: string
 *                 description: เหตุผลการคืนเงิน (optional)
 *     responses:
 *       201:
 *         description: ส่งคำขอคืนเงินสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               message: "ส่งคำขอคืนเงินสำเร็จ"
 *               refund:
 *                 id: 1
 *                 order_id: 10
 *                 amount: 500
 *                 status: "requested"
 *                 refunded_at: null
 *       400:
 *         description: ข้อมูลไม่ครบ หรือมีคำขอคืนเงินอยู่แล้ว
 *       404:
 *         description: ไม่พบคำสั่งซื้อหรือการชำระเงิน
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.post("/", authJWT, createRefund);

export default router;
