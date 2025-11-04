import express from "express";
import {
  getShipmentById,
  createShipment,
} from "../../controllers/shipping.Controller.js";
import { authJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ──────────────── USER ──────────────── */

// ✅ ผู้ใช้สามารถดูสถานะการจัดส่งของตนเองได้
router.get("/:id", authJWT, getShipmentById);

// ✅ ผู้ใช้สร้างคำสั่งจัดส่ง (กรณีร้านค้า / buyer สั่งสินค้า)
router.post("/", authJWT, createShipment);

export default router;
