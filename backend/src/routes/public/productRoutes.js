/**
 * @swagger
 * tags:
 *   name: สินค้า
 *   description: "API จัดการข้อมูลสินค้า (ผู้จัดทำ: นายคฑาวุธ เมืองพรหม)"
 */


import express from 'express';
import {
    getAllProducts,
    getProductById,
    searchProducts,
} from '../../controllers/product.Controller.js';

const router = express.Router();


/**
 * @swagger
 * /api/public/product/search:
 *   get:
 *     summary: ค้นหาสินค้าด้วยคำค้น
 *     description: ค้นหาจากชื่อหรือคำอธิบายสินค้า เช่น `?q=เสื้อ`
 *     tags: [สินค้า]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: คำค้นหา
 *     responses:
 *       200:
 *         description: ผลลัพธ์การค้นหา
 *       500:
 *         description: เกิดข้อผิดพลาดระหว่างค้นหา
 */
router.get('/search', searchProducts);




/**
 * @swagger
 * /api/public/product:
 *   get:
 *     summary: ดึงสินค้าทั้งหมด
 *     description: คืนค่าข้อมูลสินค้าทั้งหมดในระบบ หรือกรองตามหมวดหมู่ได้ด้วย `?category_id=`
 *     tags: [สินค้า]
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: รหัสหมวดหมู่สินค้า (ถ้ามี)
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสินค้าสำเร็จ
 *       500:
 *         description: ดึงข้อมูลสินค้าไม่สำเร็จ
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /api/public/product/{id}:
 *   get:
 *     summary: ดึงรายละเอียดสินค้ารายการเดียว
 *     description: ใช้รหัสสินค้า (id) เพื่อดึงข้อมูลรายละเอียดสินค้า, รูปภาพ, และหมวดหมู่
 *     tags: [สินค้า]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: รหัสสินค้า
 *     responses:
 *       200:
 *         description: พบสินค้า
 *       404:
 *         description: ไม่พบสินค้า
 */
router.get('/:id', getProductById);



export default router;
