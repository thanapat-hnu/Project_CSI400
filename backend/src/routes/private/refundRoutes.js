import express from "express";
import {
  getAllRefunds,
  getRefundById,
  updateRefundStatus,
  deleteRefund,
} from "../../controllers/refund.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ──────────────── ADMIN ──────────────── */

// ✅ ดึงรายการคืนเงินทั้งหมด
router.get("/", authJWT, authRole("admin"), getAllRefunds);

// ✅ ดึงคืนเงินรายตัว
router.get("/:id", authJWT, authRole("admin"), getRefundById);

// ✅ อัปเดตสถานะการคืนเงิน (อนุมัติ / ไม่อนุมัติ / คืนสำเร็จ)
router.put("/:id", authJWT, authRole("admin"), updateRefundStatus);

// ✅ ลบข้อมูลการคืนเงิน
router.delete("/:id", authJWT, authRole("admin"), deleteRefund);

export default router;
