import express from "express";
import {
  getShipmentById,
  createShipment,
} from "../../controllers/shipping.Controller.js";
import { authJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ──────────────── USER ──────────────── */

/**
 * @swagger
 * tags:
 *   name: การจัดส่ง
 *   description: "API สำหรับจัดการการจัดส่งสินค้า (ผู้จัดทำ: นายภูวนาท ศรุตติ์ตานนทร์)"
 */

/**
 * @swagger
 * /api/protech/shipping/{id}:
 *   get:
 *     summary: ดูสถานะการจัดส่งของตนเอง
 *     tags: [การจัดส่ง]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสการจัดส่ง
 *     responses:
 *       200:
 *         description: ดึงข้อมูลการจัดส่งสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               order_id: 10
 *               tracking_number: "TR123456789"
 *               status: "in_transit"
 *               order:
 *                 id: 10
 *                 user_id: 5
 *                 status: "shipped"
 *                 total_amount: 500
 *                 created_at: "2025-11-12T05:00:00.000Z"
 *       404:
 *         description: ไม่พบข้อมูลการจัดส่ง
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/:id", authJWT, getShipmentById);

/**
 * @swagger
 * /api/protech/shipping:
 *   post:
 *     summary: สร้างคำสั่งจัดส่งใหม่
 *     tags: [การจัดส่ง]
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
 *             properties:
 *               order_id:
 *                 type: integer
 *                 description: รหัสคำสั่งซื้อ
 *               tracking_number:
 *                 type: string
 *                 description: หมายเลขติดตาม (optional)
 *     responses:
 *       201:
 *         description: สร้างการจัดส่งสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               message: "สร้างข้อมูลการจัดส่งสำเร็จ และอัปเดตสถานะออเดอร์เป็น 'shipped'"
 *               shipment:
 *                 id: 1
 *                 order_id: 10
 *                 tracking_number: "TR123456789"
 *                 status: "pending"
 *       400:
 *         description: ข้อมูลไม่ครบ หรือมีการจัดส่งซ้ำ
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.post("/", authJWT, createShipment);

export default router;
