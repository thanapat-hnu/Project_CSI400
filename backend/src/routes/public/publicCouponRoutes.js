import express from "express";
import { getPublicCoupons } from "../../controllers/coupon.Controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: คูปอง
 *   description: "API สำหรับจัดการคูปอง (ผู้จัดทำ: นายภูวนาท ศรุตติ์ตานนทร์)"
 */

/**
 * @swagger
 * /api/public/coupon:
 *   get:
 *     summary: ดึงคูปองที่เปิดใช้งาน
 *     description: คืนค่าข้อมูลคูปองที่ active อยู่ ไม่ต้องล็อกอิน
 *     tags: [คูปอง]
 *     responses:
 *       200:
 *         description: ดึงคูปองสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: รหัสคูปอง
 *                   code:
 *                     type: string
 *                     description: รหัสคูปอง
 *                   type:
 *                     type: string
 *                     description: ประเภทคูปอง (fixed / percent)
 *                   value:
 *                     type: number
 *                     description: มูลค่าส่วนลด
 *                   start_date:
 *                     type: string
 *                     format: date
 *                     description: วันที่เริ่มใช้งานคูปอง
 *                   expire_date:
 *                     type: string
 *                     format: date
 *                     description: วันที่หมดอายุคูปอง
 *                   min_order_amount:
 *                     type: number
 *                     description: ยอดสั่งซื้อขั้นต่ำ
 *                   active:
 *                     type: boolean
 *                     description: สถานะคูปอง (ใช้งานได้หรือไม่)
 *       500:
 *         description: เกิดข้อผิดพลาดระหว่างดึงข้อมูลคูปอง
 */
router.get("/", getPublicCoupons);

export default router;
