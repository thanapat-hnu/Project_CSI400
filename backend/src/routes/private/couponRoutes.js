import express from "express";
import {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCouponStatus,
  deleteCoupon,
} from "../../controllers/coupon.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ สำหรับผู้ดูแลระบบ (Admin)
router.get("/", authJWT, authRole("admin"), getAllCoupons);
router.get("/:id", authJWT, authRole("admin"), getCouponById);
router.post("/", authJWT, authRole("admin"), createCoupon);
router.put("/:id", authJWT, authRole("admin"), updateCouponStatus);
router.delete("/:id", authJWT, authRole("admin"), deleteCoupon);

export default router;
