import express from "express";
import {
  applyCoupon,
  redeemCoupon,
  saveCoupon,
  getSavedCoupons,
  getPublicCoupons,
  getUsedCoupons,
} from "../../controllers/coupon.Controller.js";
import { authJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/public", getPublicCoupons);
router.post("/apply", authJWT, applyCoupon);
router.post("/redeem", authJWT, redeemCoupon); // 🆕 ใช้จริงหลังจ่ายเงิน
router.post("/save", authJWT, saveCoupon);
router.get("/saved", authJWT, getSavedCoupons);
router.get("/used", authJWT, getUsedCoupons);

export default router;
