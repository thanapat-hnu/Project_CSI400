import express from "express";
import {
  getRefundById,
  createRefund,
} from "../../controllers/refund.Controller.js";
import { authJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ──────────────── USER ──────────────── */

// ✅ ผู้ใช้ดูสถานะการคืนเงินของตนเอง
router.get("/:id", authJWT, getRefundById);

// ✅ ผู้ใช้ส่งคำขอคืนเงิน
router.post("/", authJWT, createRefund);

export default router;
