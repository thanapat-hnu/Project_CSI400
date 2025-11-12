import express from "express";
import {
  getAllShipments,
  getShipmentById,
  updateShipmentStatus,
  deleteShipment,
} from "../../controllers/shipping.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shipment
 *   description: "API สำหรับจัดการข้อมูลการจัดส่ง (ผู้จัดทำ: นายภูวนาท ศรุตติ์ตานนทร์)"
 */

/**
 * @swagger
 * /api/private/shipping:
 *   get:
 *     summary: ดึงรายการจัดส่งทั้งหมด (Admin)
 *     tags: [Shipment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงข้อมูลการจัดส่งสำเร็จ
 *       500:
 *         description: เกิดข้อผิดพลาดของเซิร์ฟเวอร์
 */
router.get("/", authJWT, authRole("admin"), getAllShipments);

/**
 * @swagger
 * /api/private/shipping/{id}:
 *   get:
 *     summary: ดึงข้อมูลการจัดส่งรายตัว (Admin)
 *     tags: [Shipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของการจัดส่ง
 *     responses:
 *       200:
 *         description: ดึงข้อมูลการจัดส่งสำเร็จ
 *       404:
 *         description: ไม่พบข้อมูลการจัดส่ง
 *       500:
 *         description: เกิดข้อผิดพลาดของเซิร์ฟเวอร์
 */
router.get("/:id", authJWT, authRole("admin"), getShipmentById);

/**
 * @swagger
 * /api/private/shipping/{id}:
 *   put:
 *     summary: อัปเดตสถานะการจัดส่ง (Admin)
 *     tags: [Shipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของการจัดส่ง
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_transit, delivered]
 *                 description: สถานะใหม่ของการจัดส่ง
 *               tracking_number:
 *                 type: string
 *                 description: หมายเลขติดตามพัสดุ (ถ้ามี)
 *     responses:
 *       200:
 *         description: อัปเดตสถานะการจัดส่งสำเร็จ
 *       400:
 *         description: สถานะไม่ถูกต้อง
 *       404:
 *         description: ไม่พบข้อมูลการจัดส่ง
 *       500:
 *         description: เกิดข้อผิดพลาดของเซิร์ฟเวอร์
 */
router.put("/:id", authJWT, authRole("admin"), updateShipmentStatus);

/**
 * @swagger
 * /api/private/shipping/{id}:
 *   delete:
 *     summary: ลบข้อมูลการจัดส่ง (Admin)
 *     tags: [Shipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของการจัดส่ง
 *     responses:
 *       200:
 *         description: ลบข้อมูลการจัดส่งสำเร็จ
 *       404:
 *         description: ไม่พบข้อมูลการจัดส่ง
 *       500:
 *         description: เกิดข้อผิดพลาดของเซิร์ฟเวอร์
 */
router.delete("/:id", authJWT, authRole("admin"), deleteShipment);

export default router;
