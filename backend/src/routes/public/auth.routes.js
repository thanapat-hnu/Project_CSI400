import express from 'express'
import { registerUser, loginUser } from '../../controllers/auth.Controller.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: การยืนยันตัวตน
 *   description: "API สำหรับสมัครสมาชิกและเข้าสู่ระบบ (ผู้จัดทำ: นายธนภัทร หนูบุญมี)"
 */

/**
 * @swagger
 * /api/public/auth/register:
 *   post:
 *     summary: "สมัครสมาชิกใหม่"
 *     description: "สร้างบัญชีผู้ใช้ใหม่ โดยอนุญาตเฉพาะอีเมล Hotmail เท่านั้น"
 *     tags: [การยืนยันตัวตน]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@hotmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               first_name:
 *                 type: string
 *                 example: ชื่อจริง
 *               last_name:
 *                 type: string
 *                 example: นามสกุล
 *               phone:
 *                 type: string
 *                 example: 0801234567
 *     responses:
 *       201:
 *         description: "สมัครสมาชิกสำเร็จ"
 *       400:
 *         description: "ข้อมูลไม่ครบ หรือ อีเมลไม่ถูกต้อง"
 *       409:
 *         description: "อีเมลนี้ถูกใช้แล้ว"
 *       500:
 *         description: "เกิดข้อผิดพลาดในระบบ"
 */
router.post('/register', registerUser)

/**
 * @swagger
 * /api/public/auth/login:
 *   post:
 *     summary: "เข้าสู่ระบบ"
 *     description: "เข้าสู่ระบบด้วยอีเมลและรหัสผ่านที่ลงทะเบียนไว้"
 *     tags: [การยืนยันตัวตน]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@hotmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: "เข้าสู่ระบบสำเร็จ - จะได้รับ token"
 *         content:
 *           application/json:
 *             example:
 *               message: "เข้าสู่ระบบสำเร็จ"
 *               token: "jwt_token_string"
 *       401:
 *         description: "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
 *       500:
 *         description: "เกิดข้อผิดพลาดในระบบ"
 */
router.post('/login', loginUser)

export default router
