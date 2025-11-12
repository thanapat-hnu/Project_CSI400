// routes/updateStock.route.js
import express from "express";
import { updateStockFromLatestOrder } from "../../controllers/newApi.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/protech/newapi:
 *   post:
 *     summary: อัปเดต stock ของสินค้าจากคำสั่งซื้อล่าสุด
 *     description: |
 *       ดึงคำสั่งซื้อล่าสุดของผู้ใช้ที่มี status = 'paid' แล้วอัปเดต stock ของสินค้าในคำสั่งซื้อนั้น
 *       ตามค่า `quantity` ใน order. ผลลัพธ์จะแสดงรายการสินค้าที่อัปเดต รวมทั้ง stock เก่าและใหม่
 *     tags:
 *       - newApi
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: อัปเดต stock สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: อัปเดต stock สำเร็จ
 *                 order_id:
 *                   type: integer
 *                   example: 57
 *                 updatedProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: integer
 *                         example: 20
 *                       product_name:
 *                         type: string
 *                         example: CPU (ซีพียู) AMD AM5 RYZEN 7 7700 3.8 GHz 8C 16T
 *                       category_id:
 *                         type: integer
 *                         example: 9
 *                       category_name:
 *                         type: string
 *                         example: ซีพียู (CPU)
 *                       old_stock:
 *                         type: integer
 *                         example: 200
 *                       new_stock:
 *                         type: integer
 *                         example: 199
 *                       note:
 *                         type: string
 *                         example: Stock ไม่เพียงพอ
 *       '401':
 *         description: Unauthorized - token ไม่ถูกต้อง
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       '404':
 *         description: ไม่พบคำสั่งซื้อหรือรายการสินค้า
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ไม่พบคำสั่งซื้อล่าสุด
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: เกิดข้อผิดพลาดในระบบ
 */
router.post("/", updateStockFromLatestOrder);

export default router;
