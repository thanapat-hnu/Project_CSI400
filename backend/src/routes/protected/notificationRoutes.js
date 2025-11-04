import express from "express";
import {
  getNotificationsByUser,
  getNotificationById,
  markAsRead,
} from "../../controllers/notification.Controller.js";

const router = express.Router();

router.get("/user/:user_id", getNotificationsByUser);
router.get("/:id", getNotificationById);
router.put("/:id/read", markAsRead);

export default router;
