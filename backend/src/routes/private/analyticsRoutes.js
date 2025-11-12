import express from "express";
import {
  getTotalSales,
  getDailySales,
  getTopSellingProducts,
  getOrderStatusSummary,
  getMonthlySales
} from "../../controllers/analytics.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ──────────────── ADMIN ANALYTICS ──────────────── */

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: "API สำหรับดูรายงานยอดขายและออเดอร์ (ผู้จัดทำ: นายภูวนาท ศรุตติ์ตานนทร์)"
 */

/**
 * @swagger
 * /api/private/analytics/totalsales:
 *   get:
 *     summary: ยอดขายรวมทั้งหมด
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงยอดขายรวมสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               total_sales: 15000
 *               total_payments: 25
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/totalsales", authJWT, authRole("admin"), getTotalSales);

/**
 * @swagger
 * /api/private/analytics/dailysales:
 *   get:
 *     summary: ยอดขายรายวัน
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงยอดขายรายวันสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               - date: "2025-11-01"
 *                 total_amount: 5000
 *               - date: "2025-11-02"
 *                 total_amount: 10000
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/dailysales", authJWT, authRole("admin"), getDailySales);

/**
 * @swagger
 * /api/private/analytics/topselling:
 *   get:
 *     summary: สินค้าขายดี 10 อันดับ
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงสินค้าขายดีสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               - product_id: 1
 *                 total_sold: 50
 *                 product:
 *                   id: 1
 *                   name: "สินค้า A"
 *                   price: 100
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/topselling", authJWT, authRole("admin"), getTopSellingProducts);

/**
 * @swagger
 * /api/private/analytics/ordersummary:
 *   get:
 *     summary: สรุปสถานะออเดอร์ (pending, shipped, delivered, refunded)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงรายงานสถานะออเดอร์สำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               - status: "pending"
 *                 count: 10
 *               - status: "shipped"
 *                 count: 5
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/ordersummary", authJWT, authRole("admin"), getOrderStatusSummary);

/**
 * @swagger
 * /api/private/analytics/monthlysales:
 *   get:
 *     summary: ยอดขายรายเดือน
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงยอดขายรายเดือนสำเร็จ
 *         content:
 *           application/json:
 *             example:
 *               - month: "2025-11"
 *                 total_sales: 15000
 *               - month: "2025-12"
 *                 total_sales: 20000
 *       500:
 *         description: เกิดข้อผิดพลาดในระบบ
 */
router.get("/monthlysales", authJWT, authRole("admin"), getMonthlySales);

export default router;
