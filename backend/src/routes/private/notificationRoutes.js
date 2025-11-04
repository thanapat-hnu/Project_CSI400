import express from "express";
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  deleteNotification,
  deleteAllByUser,
} from "../../controllers/notification.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ──────────────── ADMIN ──────────────── */

// ✅ ดึงแจ้งเตือนทั้งหมดในระบบ (Admin)
router.get("/", authJWT, authRole("admin"), getAllNotifications);

// ✅ ดึงแจ้งเตือนรายตัว
router.get("/:id", authJWT, authRole("admin"), getNotificationById);

// ✅ สร้างแจ้งเตือนใหม่ (Admin หรือระบบ)
router.post("/", authJWT, authRole("admin"), createNotification);

// ✅ ลบแจ้งเตือนเดี่ยว
router.delete("/:id", authJWT, authRole("admin"), deleteNotification);

// ✅ ลบแจ้งเตือนทั้งหมดของผู้ใช้บางคน (optional)
router.delete("/user/:user_id", authJWT, authRole("admin"), deleteAllByUser);

export default router;
