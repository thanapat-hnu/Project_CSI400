import express from "express";
import {
  getPayments,          
  getPaymentById,
  createPayment,
  updatePayment,        
  deletePayment,
} from "../../controllers/payment.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ──────────────── ADMIN ──────────────── */

// ✅ ดึงข้อมูลการชำระเงินทั้งหมด
router.get("/", authJWT, authRole("admin"), getPayments);

// ✅ ดึงข้อมูลการชำระเงินรายตัว
router.get("/:id", authJWT, authRole("admin"), getPaymentById);

// ✅ เพิ่มข้อมูลการชำระเงิน (กรณี admin ต้องการเพิ่มด้วยตนเอง)
router.post("/", authJWT, authRole("admin"), createPayment);

// ✅ อัปเดตข้อมูลการชำระเงิน
router.put("/:id", authJWT, authRole("admin"), updatePayment);

// ✅ ลบการชำระเงิน
router.delete("/:id", authJWT, authRole("admin"), deletePayment);

export default router;
