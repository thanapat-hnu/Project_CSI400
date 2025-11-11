import express from "express";
import {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCouponStatus,
  deleteCoupon,
  discardCoupon,
} from "../../controllers/coupon.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ สำหรับผู้ดูแลระบบ (Admin เท่านั้น)
router.get("/", authJWT, authRole("admin"), getAllCoupons);
router.get("/:id", authJWT, authRole("admin"), getCouponById);
router.post("/", authJWT, authRole("admin"), createCoupon);
router.put("/:id", authJWT, authRole("admin"), updateCouponStatus);
router.delete("/:id", authJWT, authRole("admin"), deleteCoupon);
router.delete("/discard/:coupon_id", authJWT, discardCoupon);

export default router;
