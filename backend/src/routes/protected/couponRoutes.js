import express from "express";
import {
  getAllCoupons,
  getCouponById,
  applyCoupon,
  saveCoupon,
  getSavedCoupons
} from "../../controllers/coupon.Controller.js";
import { authJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ──────────────── USER ──────────────── */

// ✅ ดึงคูปองที่เปิดใช้งานอยู่ทั้งหมด
router.get("/", authJWT, getAllCoupons);

// ✅ ดึงรายละเอียดคูปองเฉพาะตัว
router.get("/:id", authJWT, getCouponById);

// ✅ ใช้งานคูปอง (apply)
router.post("/apply", authJWT, applyCoupon);

router.post("/save", authJWT, saveCoupon);
router.get("/saved", authJWT, getSavedCoupons);


export default router;
