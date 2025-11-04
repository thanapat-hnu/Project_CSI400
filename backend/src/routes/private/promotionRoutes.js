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
router.post("/", createCoupon);
router.put("/:id/status", updateCouponStatus);
router.delete("/:id", deleteCoupon);


export default router;
