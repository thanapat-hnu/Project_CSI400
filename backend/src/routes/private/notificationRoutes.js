import express from "express";
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  deleteNotification,
  deleteAllByUser,
} from "../../controllers/notification.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: แจ้งเตือน
 *   description: "API สำหรับการแจ้งเตือน (ผู้จัดทำ: นายภูวนาท ศรุตติ์ตานนทร์)"
 */

/**
 * @swagger
 * /api/private/notification:
 *   get:
 *     summary: ดึงแจ้งเตือนทั้งหมด (Admin)
 *     tags: [แจ้งเตือน]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงแจ้งเตือนสำเร็จ
 */
router.get("/", authJWT, authRole("admin"), getAllNotifications);

/**
 * @swagger
 * /api/private/notification/{id}:
 *   get:
 *     summary: ดึงแจ้งเตือนรายตัว (Admin)
 *     tags: [แจ้งเตือน]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID ของการแจ้งเตือน
 *     responses:
 *       200:
 *         description: ดึงแจ้งเตือนสำเร็จ
 *       404:
 *         description: ไม่พบแจ้งเตือน
 */
router.get("/:id", authJWT, authRole("admin"), getNotificationById);

/**
 * @swagger
 * /api/private/notification:
 *   post:
 *     summary: สร้างแจ้งเตือนใหม่ (Admin หรือระบบ)
 *     tags: [แจ้งเตือน]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *               reference_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: สร้างแจ้งเตือนสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ครบหรือไม่ถูกต้อง
 */
router.post("/", authJWT, authRole("admin"), createNotification);

/**
 * @swagger
 * /api/private/notification/{id}:
 *   delete:
 *     summary: ลบแจ้งเตือนเดี่ยว (Admin)
 *     tags: [แจ้งเตือน]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID ของการแจ้งเตือน
 *     responses:
 *       200:
 *         description: ลบแจ้งเตือนสำเร็จ
 *       404:
 *         description: ไม่พบแจ้งเตือน
 */
router.delete("/:id", authJWT, authRole("admin"), deleteNotification);

/**
 * @swagger
 * /api/private/notification/user/{user_id}:
 *   delete:
 *     summary: ลบแจ้งเตือนทั้งหมดของผู้ใช้ (Admin)
 *     tags: [แจ้งเตือน]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: ID ของผู้ใช้
 *     responses:
 *       200:
 *         description: ลบแจ้งเตือนทั้งหมดสำเร็จ
 */
router.delete("/user/:user_id", authJWT, authRole("admin"), deleteAllByUser);

export default router;
