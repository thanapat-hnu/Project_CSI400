import express from "express";
import {
  applyCoupon,
  redeemCoupon,
  saveCoupon,
  getSavedCoupons,
  getPublicCoupons,
  getUsedCoupons,
} from "../../controllers/coupon.Controller.js";
import { authJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: คูปอง
 *   description: "API สำหรับจัดการคูปอง (ผู้จัดทำ: นายภูวนาท ศรุตติ์ตานนทร์)"
 */

router.get("/public", getPublicCoupons); //มี ปัญหาแต่ใช้งานจริงได้

/**
 * @swagger
 * /api/protech/coupon/apply:
 *   post:
 *     summary: ใช้คูปองสำหรับตะกร้า/คำสั่งซื้อ
 *     tags: [คูปอง]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - couponCode
 *               - cartId
 *             properties:
 *               couponCode:
 *                 type: string
 *                 example: "DISCOUNT10"
 *               cartId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: ใช้คูปองสำเร็จ
 *       400:
 *         description: คูปองไม่ถูกต้องหรือหมดอายุ
 *       401:
 *         description: ต้องล็อกอิน
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.post("/apply", authJWT, applyCoupon);

/**
 * @swagger
 * /api/protech/coupon/redeem:
 *   post:
 *     summary: แลกคูปองหลังชำระเงิน
 *     tags: [คูปอง]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - couponCode
 *               - orderId
 *             properties:
 *               couponCode:
 *                 type: string
 *                 example: "DISCOUNT10"
 *               orderId:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       200:
 *         description: แลกคูปองสำเร็จ
 *       400:
 *         description: คูปองไม่ถูกต้อง
 *       401:
 *         description: ต้องล็อกอิน
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.post("/redeem", authJWT, redeemCoupon);

/**
 * @swagger
 * /api/protech/coupon/save:
 *   post:
 *     summary: บันทึกคูปองไว้ใช้ภายหลัง
 *     tags: [คูปอง]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - couponCode
 *             properties:
 *               couponCode:
 *                 type: string
 *                 example: "DISCOUNT10"
 *     responses:
 *       200:
 *         description: บันทึกคูปองสำเร็จ
 *       401:
 *         description: ต้องล็อกอิน
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.post("/save", authJWT, saveCoupon);

/**
 * @swagger
 * /api/protech/coupon/saved:
 *   get:
 *     summary: ดึงคูปองที่บันทึกไว้ของผู้ใช้
 *     tags: [คูปอง]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงคูปองที่บันทึกไว้สำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               coupons:
 *                 - id: 1
 *                   code: "DISCOUNT10"
 *                   discount: 10
 *                   active: true
 *       401:
 *         description: ต้องล็อกอิน
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/saved", authJWT, getSavedCoupons);

/**
 * @swagger
 * /api/protech/coupon/used:
 *   get:
 *     summary: ดึงคูปองที่ใช้แล้วของผู้ใช้
 *     tags: [คูปอง]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงคูปองที่ใช้แล้วสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               coupons:
 *                 - id: 1
 *                   code: "DISCOUNT10"
 *                   discount: 10
 *                   usedAt: "2025-11-12T10:00:00Z"
 *       401:
 *         description: ต้องล็อกอิน
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/used", authJWT, getUsedCoupons);

export default router;
