import express from "express";
import {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from "../../controllers/payment.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: "API สำหรับการจัดการการชำระเงิน (ผู้จัดทำ: นายภูวนาท ศรุตติ์ตานนทร์)"
 */

/**
 * @swagger
 * /api/private/payment:
 *   get:
 *     summary: ดึงข้อมูลการชำระเงินทั้งหมด (Admin)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 */
router.get("/", authJWT, authRole("admin"), getPayments);

/**
 * @swagger
 * /api/private/payment/{id}:
 *   get:
 *     summary: ดึงข้อมูลการชำระเงินรายตัว (Admin)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID ของการชำระเงิน
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *       404:
 *         description: ไม่พบข้อมูลการชำระเงิน
 */
router.get("/:id", authJWT, authRole("admin"), getPaymentById);

/**
 * @swagger
 * /api/private/payment:
 *   post:
 *     summary: เพิ่มข้อมูลการชำระเงิน (Admin)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, success, failed]
 *     responses:
 *       201:
 *         description: สร้างการชำระเงินสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 */
router.post("/", authJWT, authRole("admin"), createPayment);

/**
 * @swagger
 * /api/private/payment/{id}:
 *   put:
 *     summary: อัปเดตข้อมูลการชำระเงิน (Admin)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID ของการชำระเงิน
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, success, failed]
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: อัปเดตการชำระเงินสำเร็จ
 *       404:
 *         description: ไม่พบข้อมูลการชำระเงิน
 */
router.put("/:id", authJWT, authRole("admin"), updatePayment);

/**
 * @swagger
 * /api/private/payment/{id}:
 *   delete:
 *     summary: ลบข้อมูลการชำระเงิน (Admin)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID ของการชำระเงิน
 *     responses:
 *       200:
 *         description: ลบการชำระเงินสำเร็จ
 *       404:
 *         description: ไม่พบข้อมูลการชำระเงิน
 */
router.delete("/:id", authJWT, authRole("admin"), deletePayment);

export default router;
