import express from 'express'

import {
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
} from '../../controllers/user.controller.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: ผู้ใช้
 *   description: "API จัดการข้อมูลผู้ใช้ (ผู้จัดทำ: นายธนภัทร หนูบุญมี)"
 */

/**
 * @swagger
 * /api/protech/user:
 *   get:
 *     summary: ดึงข้อมูลโปรไฟล์ตัวเอง
 *     tags: [ผู้ใช้]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               message: "ดึงข้อมูลผู้ใช้สำเร็จ"
 *               user:
 *                 email: "user@example.com"
 *                 first_name: "Tanapat"
 *                 last_name: "Nubunmee"
 *                 phone: "0812345678"
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get('/', getMyProfile)

/**
 * @swagger
 * /api/protech/user:
 *   put:
 *     summary: อัปเดตข้อมูลโปรไฟล์ตัวเอง
 *     tags: [ผู้ใช้]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@hotmail.com
 *               first_name:
 *                 type: string
 *                 example: ชื่อจริง
 *               last_name:
 *                 type: string
 *                 example: นามสกุล
 *               phone:
 *                 type: string
 *                 example: 0123456789
 *     responses:
 *       200:
 *         description: อัปเดตข้อมูลสำเร็จ
 *       400:
 *         description: ไม่มีข้อมูลที่ส่งมา
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.put('/', updateMyProfile)

/**
 * @swagger
 * /api/protech/user/password:
 *   put:
 *     summary: เปลี่ยนรหัสผ่านตัวเอง
 *     tags: [ผู้ใช้]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - old_password
 *               - new_password
 *             properties:
 *               old_password:
 *                 type: string
 *                 example: 123456
 *               new_password:
 *                 type: string
 *                 example: 654321
 *     responses:
 *       200:
 *         description: เปลี่ยนรหัสผ่านสำเร็จ
 *       400:
 *         description: รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม
 *       401:
 *         description: รหัสผ่านเดิมไม่ถูกต้อง
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.put('/password', changeMyPassword)


export default router
