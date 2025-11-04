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

// ✅ ยอดขายรวมทั้งหมด
router.get("/totalsales", authJWT, authRole("admin"), getTotalSales);

// ✅ ยอดขายรายวัน
router.get("/dailysales", authJWT, authRole("admin"), getDailySales);

// ✅ สินค้าขายดี
router.get("/topselling", authJWT, authRole("admin"), getTopSellingProducts);

// ✅ สรุปสถานะออเดอร์ (เช่น pending, shipped, delivered, refunded)
router.get("/ordersummary", authJWT, authRole("admin"), getOrderStatusSummary);

// ✅ ยอดขายรายเดือน
router.get("/monthlysales", authJWT, authRole("admin"), getMonthlySales);

export default router;
