import express from "express";
import {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCouponStatus,
  deleteCoupon
} from "../../controllers/promotion.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ──────────────── ADMIN ──────────────── */

// ✅ ดึงคูปองทั้งหมด
router.get("/", authJWT, authRole("admin"), getAllCoupons);

// ✅ ดึงคูปองรายตัว
router.get("/:id", authJWT, authRole("admin"), getCouponById);

// ✅ สร้างคูปองใหม่
router.post("/", authJWT, authRole("admin"), createCoupon);

// ✅ อัปเดตสถานะคูปอง (เปิด/ปิดการใช้งาน)
router.put("/:id/status", authJWT, authRole("admin"), updateCouponStatus);

// ✅ ลบคูปอง
router.delete("/:id", authJWT, authRole("admin"), deleteCoupon);

export default router;
