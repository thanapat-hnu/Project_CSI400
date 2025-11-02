import express from "express";
import {
  getAllNotifications,
  getNotificationsByUser,
  getNotificationById,
  createNotification,
  markAsRead,
  deleteNotification,
} from "../../controllers/notification.Controller.js";

const router = express.Router();

router.get("/", getAllNotifications);
router.get("/user/:user_id", getNotificationsByUser);
router.get("/:id", getNotificationById);
router.post("/", createNotification);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
