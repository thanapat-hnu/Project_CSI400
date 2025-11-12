import express from "express";
import {
  getAllNotifications,
  getNotificationsByUser,
  getNotificationById,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllByUser,
} from "../../controllers/notification.Controller.js";
import { authJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: แจ้งเตือน
 *   description: "API สำหรับจัดการแจ้งเตือนผู้ใช้ (ผู้จัดทำ: นายภูวนาท ศรุตติ์ตานนทร์)"
 */

/**
 * @swagger
 * /api/protech/notification:
 *   get:
 *     summary: ดึงแจ้งเตือนทั้งหมด (Admin)
 *     tags: [แจ้งเตือน]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงข้อมูลแจ้งเตือนสำเร็จ
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/", authJWT, getAllNotifications);

/**
 * @swagger
 * /api/protech/notification/user/{user_id}:
 *   get:
 *     summary: ดึงแจ้งเตือนของผู้ใช้
 *     tags: [แจ้งเตือน]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสผู้ใช้
 *     responses:
 *       200:
 *         description: ดึงแจ้งเตือนสำเร็จ
 *       404:
 *         description: ไม่พบแจ้งเตือนของผู้ใช้
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/user/:user_id", authJWT, getNotificationsByUser);

/**
 * @swagger
 * /api/protech/notification/{id}:
 *   get:
 *     summary: ดึงแจ้งเตือนตาม ID
 *     tags: [แจ้งเตือน]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสแจ้งเตือน
 *     responses:
 *       200:
 *         description: ดึงแจ้งเตือนสำเร็จ
 *       404:
 *         description: ไม่พบแจ้งเตือน
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/:id", authJWT, getNotificationById);

/**
 * @swagger
 * /api/protech/notification:
 *   post:
 *     summary: สร้างแจ้งเตือนใหม่
 *     tags: [แจ้งเตือน]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - title
 *               - message
 *             properties:
 *               user_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 description: ประเภทแจ้งเตือน (system, order, payment, etc.)
 *               reference_id:
 *                 type: integer
 *                 description: อ้างอิง ID เช่น order_id
 *     responses:
 *       201:
 *         description: สร้างแจ้งเตือนสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ครบหรือไม่ถูกต้อง
 */
router.post("/", authJWT, createNotification);

/**
 * @swagger
 * /api/protech/notification/{id}/read:
 *   put:
 *     summary: อัปเดตสถานะแจ้งเตือนเป็นอ่านแล้ว (รายตัว)
 *     tags: [แจ้งเตือน]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสแจ้งเตือน
 *     responses:
 *       200:
 *         description: อัปเดตสถานะอ่านแล้วสำเร็จ
 *       404:
 *         description: ไม่พบแจ้งเตือน
 */
router.put("/:id/read", authJWT, markAsRead);

/**
 * @swagger
 * /api/protech/notification/user/{user_id}/read-all:
 *   put:
 *     summary: อัปเดตสถานะแจ้งเตือนทั้งหมดของผู้ใช้เป็นอ่านแล้ว
 *     tags: [แจ้งเตือน]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสผู้ใช้
 *     responses:
 *       200:
 *         description: อัปเดตสถานะอ่านแล้วทั้งหมดสำเร็จ
 */
router.put("/user/:user_id/read-all", authJWT, markAllAsRead);

/**
 * @swagger
 * /api/protech/notification/{id}:
 *   delete:
 *     summary: ลบแจ้งเตือน (เดี่ยว)
 *     tags: [แจ้งเตือน]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสแจ้งเตือน
 *     responses:
 *       200:
 *         description: ลบแจ้งเตือนเรียบร้อย
 *       404:
 *         description: ไม่พบแจ้งเตือน
 */
router.delete("/:id", authJWT, deleteNotification);

/**
 * @swagger
 * /api/protech/notification/user/{user_id}:
 *   delete:
 *     summary: ลบแจ้งเตือนทั้งหมดของผู้ใช้
 *     tags: [แจ้งเตือน]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสผู้ใช้
 *     responses:
 *       200:
 *         description: ลบแจ้งเตือนทั้งหมดเรียบร้อย
 */
router.delete("/user/:user_id", authJWT, deleteAllByUser);

export default router;
