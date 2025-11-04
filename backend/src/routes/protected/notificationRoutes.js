import express from "express";
import {
  getNotificationsByUser,
  markAsRead,
  markAllAsRead,
} from "../../controllers/notification.Controller.js";
import { authJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ──────────────── USER ──────────────── */

// ✅ ดึงแจ้งเตือนของ user
router.get("/user/:user_id", authJWT, getNotificationsByUser);

// ✅ อัปเดตสถานะ “อ่านแล้ว” รายตัว
router.put("/:id/read", authJWT, markAsRead);

// ✅ อัปเดตสถานะ “อ่านแล้ว” ทั้งหมดของ user
router.put("/user/:user_id/read-all", authJWT, markAllAsRead);

export default router;
