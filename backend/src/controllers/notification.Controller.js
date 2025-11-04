import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { Op } from "sequelize";

/* ──────────────── GET ──────────────── */
// ดึงแจ้งเตือนทั้งหมด (สำหรับ Admin)
export const getAllNotifications = async (_req, res) => {
  try {
    const notifications = await Notification.findAll({
      include: [
        { 
          model: User, 
          as: "user", 
          attributes: ["id", "email", "first_name", "last_name"] // ✅ เปลี่ยนจาก username เป็นฟิลด์ที่มีจริง
        },
      ],
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
    const notification = await Notification.findByPk(id, {
      include: [
        { 
          model: User, 
          as: "user", 
          attributes: ["id", "email", "first_name", "last_name"] // ✅ ใช้ field ที่มีจริง
        },
      ],
    });

    if (!notification)
      return res.status(404).json({ message: "ไม่พบการแจ้งเตือน" });

    res.json(notification);
  } catch (err) {
    console.error("Error fetching notification:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลการแจ้งเตือนได้" });
  }
};

/* ──────────────── CREATE ──────────────── */
// ✅ สร้างการแจ้งเตือนใหม่ (สำหรับระบบหรือผู้ดูแล)
export const createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type, reference_id } = req.body;

    if (!user_id || !title || !message)
      return res
        .status(400)
        .json({ message: "กรุณาระบุ user_id, title และ message" });

    const notification = await Notification.create({
      user_id,
      title,
      message,
      type: type || "system",
      reference_id: reference_id || null,
      is_read: false,
    });

    res.status(201).json({ message: "สร้างการแจ้งเตือนสำเร็จ", notification });
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(400).json({ message: "ไม่สามารถสร้างการแจ้งเตือนได้" });
  }
};

/* ──────────────── AUTO ──────────────── */
// ✅ ใช้เรียกจาก controller อื่น เช่น Order / Payment / Refund / Shipment / Coupon
export const sendAutoNotification = async (
  user_id,
  type,
  reference_id = null,
  extraMessage = ""
) => {
  try {
    // ✅ Template ของข้อความตามประเภท
    const templates = {
      order: {
        title: "สร้างคำสั่งซื้อใหม่ 🧾",
        message: `คุณได้สร้างคำสั่งซื้อหมายเลข #${reference_id} สำเร็จแล้ว`,
      },
      payment: {
        title: "การชำระเงินสำเร็จ 💳",
        message: `คำสั่งซื้อ #${reference_id} ชำระเงินเรียบร้อยแล้ว`,
      },
      shipping: {
        title: "สถานะการจัดส่ง 🚚",
        message: extraMessage
          ? `คำสั่งซื้อ #${reference_id} ${extraMessage}`
          : `คำสั่งซื้อ #${reference_id} กำลังจัดส่ง`,
      },
      refund: {
        title: "สถานะการคืนเงิน 💸",
        message:
          extraMessage ||
          `คำสั่งซื้อ #${reference_id} อยู่ระหว่างดำเนินการคืนเงิน`,
      },
      coupon: {
        title: "การใช้คูปอง 🎁",
        message: extraMessage || "คุณได้รับส่วนลดจากคูปองที่ใช้เรียบร้อยแล้ว",
      },
      system: {
        title: "แจ้งเตือนจากระบบ ℹ️",
        message: extraMessage || "มีการอัปเดตใหม่ในระบบ",
      },
    };

    const { title, message } = templates[type] || templates.system;

    // ✅ บันทึกลงฐานข้อมูล
    await Notification.create({
      user_id,
      type,
      title,
      message,
      reference_id,
      is_read: false,
    });

    console.log(`✅ Notification sent [${type}] for user_id=${user_id}`);
  } catch (err) {
    console.error("❌ Error sending auto-notification:", err.message);
  }
};

/* ──────────────── UPDATE ──────────────── */
// ✅ อัปเดตสถานะ "อ่านแล้ว"
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Notification.update(
      { is_read: true },
      { where: { id } }
    );

    if (!updated)
      return res.status(404).json({ message: "ไม่พบการแจ้งเตือน" });

    const updatedNotification = await Notification.findByPk(id);
    res.json({
      message: "อัปเดตสถานะอ่านแล้วสำเร็จ",
      notification: updatedNotification,
    });
  } catch (err) {
    console.error("Error updating notification:", err);
    res.status(400).json({ message: "ไม่สามารถอัปเดตสถานะได้" });
  }
};

// ✅ อัปเดตทั้งหมดของผู้ใช้ให้เป็น “อ่านแล้ว”
export const markAllAsRead = async (req, res) => {
  try {
    const { user_id } = req.params;
    await Notification.update({ is_read: true }, { where: { user_id } });

    res.json({ message: "อัปเดตการแจ้งเตือนทั้งหมดเป็นอ่านแล้วสำเร็จ" });
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    res.status(400).json({ message: "ไม่สามารถอัปเดตสถานะทั้งหมดได้" });
  }
};

/* ──────────────── DELETE ──────────────── */
// ✅ ลบการแจ้งเตือน (เดี่ยว)
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

// ✅ ลบแจ้งเตือนทั้งหมดของผู้ใช้ (optional)
export const deleteAllByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    await Notification.destroy({ where: { user_id } });

    res.json({ message: "ลบการแจ้งเตือนทั้งหมดของผู้ใช้เรียบร้อย" });
  } catch (err) {
    console.error("Error deleting notifications:", err);
    res.status(500).json({ message: "ไม่สามารถลบการแจ้งเตือนของผู้ใช้ได้" });
  }
};
