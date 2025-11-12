import express from "express";
import {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCouponStatus,
  deleteCoupon,
  discardCoupon,
} from "../../controllers/coupon.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Coupon
 *   description: "API สำหรับคูปอง (ผู้จัดทำ: นายคฑาวุธ เมืองพรหม)"
 */

/**
 * @swagger
 * /api/private/coupon:
 *   get:
 *     summary: ดึงคูปองทั้งหมด (Admin)
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงคูปองสำเร็จ
 */
router.get("/", authJWT, authRole("admin"), getAllCoupons);

/**
 * @swagger
 * /api/private/coupon/{id}:
 *   get:
 *     summary: ดึงคูปองรายตัว (Admin)
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID ของคูปอง
 *     responses:
 *       200:
 *         description: ดึงคูปองสำเร็จ
 *       404:
 *         description: ไม่พบคูปอง
 */
router.get("/:id", authJWT, authRole("admin"), getCouponById);

/**
 * @swagger
 * /api/private/coupon:
 *   post:
 *     summary: สร้างคูปองใหม่ (Admin)
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               type:
 *                 type: string
 *               value:
 *                 type: number
 *               start_date:
 *                 type: string
 *                 format: date
 *               expire_date:
 *                 type: string
 *                 format: date
 *               min_order_amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: สร้างคูปองสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 */
router.post("/", authJWT, authRole("admin"), createCoupon);

/**
 * @swagger
 * /api/private/coupon/{id}:
 *   put:
 *     summary: อัปเดตสถานะคูปอง (Admin)
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID ของคูปอง
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               active:
 *                 type: integer
 *     responses:
 *       200:
 *         description: อัปเดตสถานะสำเร็จ
 *       404:
 *         description: ไม่พบคูปอง
 */
router.put("/:id", authJWT, authRole("admin"), updateCouponStatus);

/**
 * @swagger
 * /api/private/coupon/{id}:
 *   delete:
 *     summary: ลบคูปอง (Admin)
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID ของคูปอง
 *     responses:
 *       200:
 *         description: ลบคูปองสำเร็จ
 *       404:
 *         description: ไม่พบคูปอง
 */
router.delete("/:id", authJWT, authRole("admin"), deleteCoupon);

/**
 * @swagger
 * /api/private/coupon/discard/{coupon_id}:
 *   delete:
 *     summary: ลบคูปองหมดอายุออกจากบัญชีผู้ใช้
 *     tags: [Coupon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: coupon_id
 *         in: path
 *         required: true
 *         description: ID ของคูปอง
 *     responses:
 *       200:
 *         description: ลบคูปองสำเร็จ
 *       400:
 *         description: คูปองยังไม่หมดอายุ
 *       404:
 *         description: ไม่พบคูปอง
 */
router.delete("/discard/:coupon_id", authJWT, discardCoupon);

export default router;
