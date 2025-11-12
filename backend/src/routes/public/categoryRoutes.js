import express from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubCategories
} from '../../controllers/category.Controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: หมวดหมู่สินค้า
 *   description: "API สำหรับจัดการหมวดหมู่สินค้า (ผู้จัดทำ: นายคฑาวุธ เมืองพรหม)"
 */

/**
 * @swagger
 * /api/public/category:
 *   get:
 *     summary: "ดึงข้อมูลหมวดหมู่หลักทั้งหมด"
 *     description: "ดึงข้อมูลหมวดหมู่หลักทั้งหมด (parent_id = null)"
 *     tags: [หมวดหมู่สินค้า]
 *     responses:
 *       200:
 *         description: "ดึงข้อมูลหมวดหมู่สำเร็จ"
 *       500:
 *         description: "เกิดข้อผิดพลาดในระบบ"
 */
router.get('/', getAllCategories);

/**
 * @swagger
 * /api/public/category/sub:
 *   get:
 *     summary: "ดึงข้อมูลหมวดย่อยทั้งหมด"
 *     description: "ดึงข้อมูลหมวดหมู่ที่มี parent_id ไม่เป็น null"
 *     tags: [หมวดหมู่สินค้า]
 *     responses:
 *       200:
 *         description: "ดึงข้อมูลหมวดย่อยสำเร็จ"
 *       500:
 *         description: "เกิดข้อผิดพลาดในระบบ"
 */
router.get("/sub", getSubCategories);


// router.get('/:id', getCategoryById);

/**
 * @swagger
 * /api/public/category:
 *   post:
 *     summary: "เพิ่มหมวดหมู่ใหม่"
 *     description: "สร้างหมวดหมู่ใหม่ สามารถระบุ parent_id ได้หากเป็นหมวดย่อย"
 *     tags: [หมวดหมู่สินค้า]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "เครื่องใช้ไฟฟ้า"
 *               parent_id:
 *                 type: integer
 *                 example: null
 *     responses:
 *       201:
 *         description: "เพิ่มหมวดหมู่สำเร็จ"
 *       400:
 *         description: "ข้อมูลไม่ครบ"
 *       500:
 *         description: "เกิดข้อผิดพลาดในระบบ"
 */
router.post('/', createCategory);

/**
 * @swagger
 * /api/public/category/{id}:
 *   put:
 *     summary: "แก้ไขข้อมูลหมวดหมู่"
 *     description: "อัปเดตชื่อหรือ parent_id ของหมวดหมู่ตาม ID"
 *     tags: [หมวดหมู่สินค้า]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID ของหมวดหมู่"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "เครื่องใช้ในบ้าน"
 *               parent_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: "อัปเดตหมวดหมู่สำเร็จ"
 *       404:
 *         description: "ไม่พบหมวดหมู่"
 *       500:
 *         description: "เกิดข้อผิดพลาดในระบบ"
 */
router.put('/:id', updateCategory);

/**
 * @swagger
 * /api/public/category/{id}:
 *   delete:
 *     summary: "ลบหมวดหมู่"
 *     description: "ลบหมวดหมู่ตาม ID"
 *     tags: [หมวดหมู่สินค้า]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID ของหมวดหมู่"
 *     responses:
 *       200:
 *         description: "ลบหมวดหมู่สำเร็จ"
 *       404:
 *         description: "ไม่พบหมวดหมู่"
 *       500:
 *         description: "เกิดข้อผิดพลาดในระบบ"
 */
router.delete('/:id', deleteCategory);

export default router;
