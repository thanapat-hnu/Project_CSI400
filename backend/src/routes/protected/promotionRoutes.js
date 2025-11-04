import express from "express";
import {
  getAllCoupons,
  getCouponById,
  applyCoupon
} from "../../controllers/promotion.Controller.js";
import { authJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ──────────────── USER ──────────────── */

// ✅ ดึงคูปองที่เปิดใช้งานอยู่ทั้งหมด
router.get("/", authJWT, getAllCoupons);

// ✅ ดึงรายละเอียดคูปองเฉพาะตัว
router.get("/:id", authJWT, getCouponById);

// ✅ ใช้งานคูปอง (apply)
router.post("/apply", authJWT, applyCoupon);

export default router;
