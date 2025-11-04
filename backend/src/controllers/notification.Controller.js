import Notification from "../models/Notification.js";
import { Op } from "sequelize";

/* ──────────────── GET ──────────────── */
// ดึงแจ้งเตือนทั้งหมด
export const getAllNotifications = async (_req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [["created_at", "DESC"]],
    });
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลการแจ้งเตือนได้" });
  }
};

// ดึงแจ้งเตือนของผู้ใช้แต่ละคน
export const getNotificationsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const notifications = await Notification.findAll({
      where: { user_id },
      order: [["created_at", "DESC"]],
    });

    if (!notifications.length)
      return res.status(404).json({ message: "ไม่พบการแจ้งเตือนของผู้ใช้นี้" });

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching user notifications:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลการแจ้งเตือนของผู้ใช้ได้" });
  }
};

// ดึงแจ้งเตือนรายตัว
export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification)
      return res.status(404).json({ message: "ไม่พบการแจ้งเตือน" });

    res.json(notification);
  } catch (err) {
    console.error("Error fetching notification:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลการแจ้งเตือนได้" });
  }
};

/* ──────────────── CREATE ──────────────── */
// สร้างการแจ้งเตือนใหม่
export const createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;

    if (!user_id || !title || !message)
      return res.status(400).json({ message: "กรุณาระบุ user_id, title และ message" });

    const notification = await Notification.create({
      user_id,
      title,
      message,
      type: type || "system",
    });

    res.status(201).json({ message: "สร้างการแจ้งเตือนสำเร็จ", notification });
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(400).json({ message: "ไม่สามารถสร้างการแจ้งเตือนได้" });
  }
};

/* ──────────────── UPDATE ──────────────── */
// อัปเดตสถานะอ่านแล้ว
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Notification.update(
      { is_read: true },
      { where: { id } }
    );

    if (!updated) return res.status(404).json({ message: "ไม่พบการแจ้งเตือน" });

    const updatedNotification = await Notification.findByPk(id);
    res.json({ message: "อัปเดตสถานะอ่านแล้วสำเร็จ", notification: updatedNotification });
  } catch (err) {
    console.error("Error updating notification:", err);
    res.status(400).json({ message: "ไม่สามารถอัปเดตสถานะได้" });
  }
};

/* ──────────────── DELETE ──────────────── */
// ลบแจ้งเตือน
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.destroy({ where: { id } });

    if (!deleted)
      return res.status(404).json({ message: "ไม่พบการแจ้งเตือน" });

    res.json({ message: "ลบการแจ้งเตือนเรียบร้อย" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).json({ message: "ไม่สามารถลบการแจ้งเตือนได้" });
  }
};
