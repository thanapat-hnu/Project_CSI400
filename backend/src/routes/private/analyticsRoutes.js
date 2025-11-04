import express from "express";
import {
  getTotalSales,
  getDailySales,
  getTopSellingProducts,
  getOrderStatusSummary,
  getMonthlySales
} from "../../controllers/analytics.Controller.js";

const router = express.Router();

router.get("/totalsales", getTotalSales);
router.get("/dailysales", getDailySales);
router.get("/topselling", getTopSellingProducts);
router.get("/ordersummary", getOrderStatusSummary);
router.get("/monthlysales", getMonthlySales);

export default router;
