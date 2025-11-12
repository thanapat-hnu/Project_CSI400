import express from 'express'
import { getAddresses, getAddressById, createAddress, updateAddress, deleteAddress } from '../../controllers/address.controller.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: ที่อยู่
 *   description: "API สำหรับจัดการที่อยู่ผู้ใช้ (ผู้จัดทำ: นายธนภัทร หนูบุญมี)"
 */

/**
 * @swagger
 * /api/protech/address:
 *   get:
 *     summary: ดึงที่อยู่ทั้งหมดของผู้ใช้
 *     tags: [ที่อยู่]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงข้อมูลที่อยู่สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 addresses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       address_line:
 *                         type: string
 *                       city:
 *                         type: string
 *                       province:
 *                         type: string
 *                       postal_code:
 *                         type: string
 *                       phone:
 *                         type: string
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get('/', getAddresses)

/**
 * @swagger
 * /api/protech/address/{id}:
 *   get:
 *     summary: ดึงที่อยู่ตาม ID
 *     tags: [ที่อยู่]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสที่อยู่
 *     responses:
 *       200:
 *         description: ดึงข้อมูลที่อยู่สำเร็จ
 *       404:
 *         description: ไม่พบที่อยู่
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get('/:id', getAddressById)

/**
 * @swagger
 * /api/protech/address:
 *   post:
 *     summary: เพิ่มที่อยู่ใหม่
 *     tags: [ที่อยู่]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressLine
 *               - city
 *               - province
 *               - postalCode
 *               - phone
 *             properties:
 *               addressLine:
 *                 type: string
 *                 example: 123 หมู่บ้านสุขใจ
 *               city:
 *                 type: string
 *                 example: บางกอก
 *               province:
 *                 type: string
 *                 example: กรุงเทพมหานคร
 *               postalCode:
 *                 type: string
 *                 example: 10210
 *               phone:
 *                 type: string
 *                 example: 0812345678
 *     responses:
 *       201:
 *         description: เพิ่มที่อยู่สำเร็จ
 *       400:
 *         description: ข้อมูลไม่ครบหรือไม่ถูกต้อง
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.post('/', createAddress)

/**
 * @swagger
 * /api/protech/address/{id}:
 *   put:
 *     summary: แก้ไขที่อยู่
 *     tags: [ที่อยู่]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสที่อยู่
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressLine
 *               - city
 *               - province
 *               - postalCode
 *               - phone
 *             properties:
 *               addressLine:
 *                 type: string
 *                 example: 321 หมู่บ้านสุขใจ
 *               city:
 *                 type: string
 *                 example: บางกอก
 *               province:
 *                 type: string
 *                 example: กรุงเทพมหานคร
 *               postalCode:
 *                 type: string
 *                 example: 10210
 *               phone:
 *                 type: string
 *                 example: 0812345678
 *     responses:
 *       200:
 *         description: แก้ไขที่อยู่สำเร็จ
 *       400:
 *         description: ข้อมูลไม่ครบหรือไม่ถูกต้อง
 *       404:
 *         description: ไม่พบที่อยู่หรือไม่มีสิทธิ์แก้ไข
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.put('/:id', updateAddress)

/**
 * @swagger
 * /api/protech/address/{id}:
 *   delete:
 *     summary: ลบที่อยู่
 *     tags: [ที่อยู่]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสที่อยู่
 *     responses:
 *       200:
 *         description: ลบที่อยู่สำเร็จ
 *       404:
 *         description: ไม่พบที่อยู่หรือไม่มีสิทธิ์ลบ
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.delete('/:id', deleteAddress)

export default router
