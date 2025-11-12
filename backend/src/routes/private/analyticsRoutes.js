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
router.get("/totalsales", authJWT, authRole("admin"), getTotalSales);

router.get("/dailysales", authJWT, authRole("admin"), getDailySales);

router.get("/topselling", authJWT, authRole("admin"), getTopSellingProducts);

router.get("/ordersummary", authJWT, authRole("admin"), getOrderStatusSummary);

router.get("/monthlysales", authJWT, authRole("admin"), getMonthlySales);

export default router;
