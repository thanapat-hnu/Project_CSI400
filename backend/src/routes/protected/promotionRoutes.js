import express from "express";
import {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCouponStatus,
  deleteCoupon,
  applyCoupon
} from "../../controllers/promotion.Controller.js";

const router = express.Router();

router.get("/", getAllCoupons);
router.get("/:id", getCouponById);
router.post("/apply", applyCoupon);

export default router;
