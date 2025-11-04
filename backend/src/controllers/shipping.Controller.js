import Shipment from "../models/Shipment.js";
import Order from "../models/Order.js";
import { sendAutoNotification } from "./notification.Controller.js";
import { Op } from "sequelize";

/* ──────────────── GET ──────────────── */
// ดึงข้อมูลการจัดส่งทั้งหมด
export const getAllShipments = async (_req, res) => {
  try {
    const shipments = await Shipment.findAll({
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id", "user_id", "status", "total_amount", "created_at"],
        },
      ],
      order: [["id", "DESC"]],
    });
    res.json(shipments);
  } catch (err) {
    console.error("Error fetching shipments:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลการจัดส่งได้" });
  }
};

// ดึงข้อมูลการจัดส่งตาม ID
export const getShipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findByPk(id, {
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id", "user_id", "status", "total_amount", "created_at"],
        },
      ],
    });

    if (!shipment)
      return res.status(404).json({ message: "ไม่พบข้อมูลการจัดส่ง" });

    res.json(shipment);
  } catch (err) {
    console.error("Error fetching shipment:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลการจัดส่งได้" });
  }
};

/* ──────────────── CREATE ──────────────── */
// ✅ สร้างข้อมูลการจัดส่งใหม่ (พร้อมแจ้งเตือน)
export const createShipment = async (req, res) => {
  const t = await Shipment.sequelize.transaction();
  try {
    const { order_id, tracking_number } = req.body;

    if (!order_id) {
      return res.status(400).json({ message: "กรุณาระบุ order_id" });
    }

    const order = await Order.findByPk(order_id, { transaction: t });
    if (!order)
      return res.status(400).json({ message: "ไม่พบคำสั่งซื้อที่ระบุ" });

    const existing = await Shipment.findOne({
      where: { order_id },
      transaction: t,
    });
    if (existing)
      return res.status(400).json({ message: "มีข้อมูลการจัดส่งสำหรับออเดอร์นี้แล้ว" });

    const shipment = await Shipment.create(
      {
        order_id,
        tracking_number: tracking_number || null,
        status: "pending",
      },
      { transaction: t }
    );

    await order.update({ status: "shipped" }, { transaction: t });

    await t.commit();

    // ✅ แจ้งเตือนผู้ใช้ว่าเริ่มจัดส่งแล้ว
    await sendAutoNotification(
      order.user_id,
      "shipping",
      order.id,
      `คำสั่งซื้อของคุณกำลังเตรียมจัดส่ง${tracking_number ? " หมายเลขติดตาม: " + tracking_number : ""}`
    );

    res.status(201).json({
      message: "สร้างข้อมูลการจัดส่งสำเร็จ และอัปเดตสถานะออเดอร์เป็น 'shipped'",
      shipment,
    });
  } catch (err) {
    await t.rollback();
    console.error("Error creating shipment:", err);
    res.status(400).json({ message: "ไม่สามารถสร้างข้อมูลการจัดส่งได้" });
  }
};

/* ──────────────── UPDATE ──────────────── */
// ✅ อัปเดตสถานะการจัดส่ง (พร้อมแจ้งเตือน)
export const updateShipmentStatus = async (req, res) => {
  const t = await Shipment.sequelize.transaction();
  try {
    const { id } = req.params;
    const { status, tracking_number } = req.body;

    const validStatus = ["pending", "in_transit", "delivered"];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({ message: "สถานะไม่ถูกต้อง" });
    }

    const shipment = await Shipment.findByPk(id, {
      include: [{ model: Order, as: "order" }],
      transaction: t,
    });

    if (!shipment)
      return res.status(404).json({ message: "ไม่พบข้อมูลการจัดส่ง" });

    shipment.status = status || shipment.status;
    shipment.tracking_number = tracking_number || shipment.tracking_number;
    await shipment.save({ transaction: t });

    const order = shipment.order;
    if (order) {
      if (status === "in_transit") {
        await order.update({ status: "shipped" }, { transaction: t });

        // ✅ แจ้งเตือนเมื่อเริ่มจัดส่ง
        await sendAutoNotification(
          order.user_id,
          "shipping",
          order.id,
          `คำสั่งซื้อของคุณอยู่ระหว่างการจัดส่ง 🚚 หมายเลขติดตาม: ${shipment.tracking_number || "-"}`
        );
      } else if (status === "delivered") {
        await order.update({ status: "completed" }, { transaction: t });

        // ✅ แจ้งเตือนเมื่อจัดส่งสำเร็จ
        await sendAutoNotification(
          order.user_id,
          "shipping",
          order.id,
          "คำสั่งซื้อของคุณถูกจัดส่งเรียบร้อยแล้ว ✅"
        );
      }
    }

    await t.commit();

    res.json({
      message: "อัปเดตสถานะการจัดส่งสำเร็จ",
      shipment,
    });
  } catch (err) {
    await t.rollback();
    console.error("Error updating shipment:", err);
    res.status(400).json({ message: "ไม่สามารถอัปเดตข้อมูลการจัดส่งได้" });
  }
};

/* ──────────────── DELETE ──────────────── */
// ✅ ลบข้อมูลการจัดส่ง (พร้อมแจ้งเตือน)
export const deleteShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findByPk(id, {
      include: [{ model: Order, as: "order", attributes: ["id", "user_id"] }],
    });

    if (!shipment) return res.status(404).json({ message: "ไม่พบข้อมูลการจัดส่ง" });

    await shipment.destroy();

    // ✅ แจ้งเตือนเมื่อการจัดส่งถูกลบ
    if (shipment.order && shipment.order.user_id) {
      await sendAutoNotification(
        shipment.order.user_id,
        "shipping",
        shipment.order.id,
        "ข้อมูลการจัดส่งของคุณถูกยกเลิก"
      );
    }

    res.json({ message: "ลบข้อมูลการจัดส่งเรียบร้อย" });
  } catch (err) {
    console.error("Error deleting shipment:", err);
    res.status(500).json({ message: "ไม่สามารถลบข้อมูลการจัดส่งได้" });
  }
};
