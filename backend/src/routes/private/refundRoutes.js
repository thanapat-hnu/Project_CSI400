import express from "express";
import {
  getAllRefunds,
  getRefundById,
  updateRefundStatus,
  deleteRefund,
} from "../../controllers/refund.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Refund
 *   description: "API สำหรับจัดการคำขอคืนเงิน (ผู้จัดทำ: นายภูวนาท ศรุตติ์ตานนทร์)"
 */

/**
 * @swagger
 * /api/private/refund:
 *   get:
 *     summary: ดึงรายการคืนเงินทั้งหมด (Admin)
 *     tags: [Refund]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงข้อมูลคำขอคืนเงินสำเร็จ
 *       500:
 *         description: เกิดข้อผิดพลาดของเซิร์ฟเวอร์
 */
router.get("/", authJWT, authRole("admin"), getAllRefunds);

/**
 * @swagger
 * /api/private/refund/{id}:
 *   get:
 *     summary: ดึงข้อมูลคำขอคืนเงินรายตัว (Admin)
 *     tags: [Refund]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของคำขอคืนเงิน
 *     responses:
 *       200:
 *         description: ดึงข้อมูลคำขอคืนเงินสำเร็จ
 *       404:
 *         description: ไม่พบคำขอคืนเงิน
 *       500:
 *         description: เกิดข้อผิดพลาดของเซิร์ฟเวอร์
 */
router.get("/:id", authJWT, authRole("admin"), getRefundById);

/**
 * @swagger
 * /api/private/refund/{id}:
 *   put:
 *     summary: อัปเดตสถานะคำขอคืนเงิน (Admin)
 *     tags: [Refund]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของคำขอคืนเงิน
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [requested, approved, rejected, completed]
 *                 description: สถานะใหม่ของคำขอคืนเงิน
 *     responses:
 *       200:
 *         description: อัปเดตสถานะคำขอคืนเงินสำเร็จ
 *       400:
 *         description: สถานะไม่ถูกต้อง
 *       404:
 *         description: ไม่พบคำขอคืนเงิน
 *       500:
 *         description: เกิดข้อผิดพลาดของเซิร์ฟเวอร์
 */
router.put("/:id", authJWT, authRole("admin"), updateRefundStatus);

/**
 * @swagger
 * /api/private/refund/{id}:
 *   delete:
 *     summary: ลบคำขอคืนเงิน (Admin)
 *     tags: [Refund]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของคำขอคืนเงิน
 *     responses:
 *       200:
 *         description: ลบคำขอคืนเงินสำเร็จ
 *       404:
 *         description: ไม่พบคำขอคืนเงิน
 *       500:
 *         description: เกิดข้อผิดพลาดของเซิร์ฟเวอร์
 */
router.delete("/:id", authJWT, authRole("admin"), deleteRefund);

export default router;
