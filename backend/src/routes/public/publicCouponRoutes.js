import express from "express";
import { getPublicCoupons } from "../../controllers/coupon.Controller.js";

const router = express.Router();

// ✅ ดึงคูปองที่เปิดใช้งาน (ไม่ต้องล็อกอิน)
router.get("/", getPublicCoupons);

export default router;
