import express from "express";
import {
  getAllShipments,
  getShipmentById,
  updateShipmentStatus,
  deleteShipment,
} from "../../controllers/shipping.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ──────────────── ADMIN ──────────────── */

// ✅ ดึงรายการจัดส่งทั้งหมด
router.get("/", authJWT, authRole("admin"), getAllShipments);

// ✅ ดึงข้อมูลการจัดส่งรายตัว
router.get("/:id", authJWT, authRole("admin"), getShipmentById);

// ✅ อัปเดตสถานะการจัดส่ง (เช่น กำลังจัดส่ง / จัดส่งสำเร็จ)
router.put("/:id", authJWT, authRole("admin"), updateShipmentStatus);

// ✅ ลบข้อมูลการจัดส่ง (เฉพาะ admin)
router.delete("/:id", authJWT, authRole("admin"), deleteShipment);

export default router;
