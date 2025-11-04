import express from "express";
import {
  getPaymentById,
  createPayment,
} from "../../controllers/payment.Controller.js";
import { authJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ──────────────── USER ──────────────── */

// ✅ ผู้ใช้สามารถดูการชำระเงินของตัวเองได้
router.get("/:id", authJWT, getPaymentById);

// ✅ ผู้ใช้สร้างการชำระเงินของตัวเองได้
router.post("/", authJWT, createPayment);

export default router;
