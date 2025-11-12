import express from "express";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../../controllers/order.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: คำสั่งซื้อ
 *   description: "API สำหรับการจัดการคำสั่งซื้อ (ผู้จัดทำ: นายภูวนาท ศรุตติ์ตานนทร์)"
 */

/**
 * @swagger
 * /api/private/order:
 *   get:
 *     summary: ดึงคำสั่งซื้อทั้งหมด (Admin)
 *     tags: [คำสั่งซื้อ]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงคำสั่งซื้อสำเร็จ
 */
router.get("/", authJWT, authRole("admin"), getAllOrders);

/**
 * @swagger
 * /api/private/order/{id}:
 *   get:
 *     summary: ดึงคำสั่งซื้อรายตัว (Admin)
 *     tags: [คำสั่งซื้อ]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID ของคำสั่งซื้อ
 *     responses:
 *       200:
 *         description: ดึงคำสั่งซื้อสำเร็จ
 *       404:
 *         description: ไม่พบคำสั่งซื้อ
 */
router.get("/:id", authJWT, authRole("admin"), getOrderById);

/**
 * @swagger
 * /api/private/order/{id}:
 *   put:
 *     summary: อัปเดตสถานะคำสั่งซื้อ (Admin)
 *     tags: [คำสั่งซื้อ]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID ของคำสั่งซื้อ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, completed]
 *     responses:
 *       200:
 *         description: อัปเดตสถานะคำสั่งซื้อสำเร็จ
 *       400:
 *         description: ข้อมูลสถานะไม่ถูกต้อง
 *       404:
 *         description: ไม่พบคำสั่งซื้อ
 */
router.put("/:id", authJWT, authRole("admin"), updateOrderStatus);

/**
 * @swagger
 * /api/private/order/{id}:
 *   delete:
 *     summary: ลบคำสั่งซื้อ (Admin)
 *     tags: [คำสั่งซื้อ]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID ของคำสั่งซื้อ
 *     responses:
 *       200:
 *         description: ลบคำสั่งซื้อสำเร็จ
 *       404:
 *         description: ไม่พบคำสั่งซื้อ
 */
router.delete("/:id", authJWT, authRole("admin"), deleteOrder);

export default router;
