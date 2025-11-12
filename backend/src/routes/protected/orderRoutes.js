import express from "express";
import {
  getOrdersByUser,
  getOrderById,
  createOrder,
} from "../../controllers/order.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: คำสั่งซื้อ
 *   description: "API สำหรับจัดการคำสั่งซื้อ (ผู้จัดทำ: นายภูวนาท ศรุตติ์ตานนทร์)"
 */

/**
 * @swagger
 * /api/protech/order/user/{user_id}:
 *   get:
 *     summary: ดึงคำสั่งซื้อของผู้ใช้
 *     tags: [คำสั่งซื้อ]
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
 *         description: ดึงคำสั่งซื้อสำเร็จ
 *       404:
 *         description: ไม่พบคำสั่งซื้อของผู้ใช้
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/user/:user_id", authJWT, authRole("user", "admin"), getOrdersByUser);

/**
 * @swagger
 * /api/protech/order/{id}:
 *   get:
 *     summary: ดึงคำสั่งซื้อโดย ID
 *     tags: [คำสั่งซื้อ]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสคำสั่งซื้อ
 *     responses:
 *       200:
 *         description: ดึงคำสั่งซื้อสำเร็จ
 *       404:
 *         description: ไม่พบคำสั่งซื้อ
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/:id", authJWT, authRole("user", "admin"), getOrderById);

/**
 * @swagger
 * /api/protech/order:
 *   post:
 *     summary: สร้างคำสั่งซื้อใหม่
 *     tags: [คำสั่งซื้อ]
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
 *               - items
 *             properties:
 *               user_id:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                     - price
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: สร้างคำสั่งซื้อสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ครบหรือไม่ถูกต้อง
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.post("/", authJWT, authRole("user", "admin"), createOrder);

export default router;
