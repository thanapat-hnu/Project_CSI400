import Shipment from "../models/Shipment.js";
import { Op } from "sequelize";

/* ──────────────── GET ──────────────── */
// ดึงข้อมูลการจัดส่งทั้งหมด
export const getAllShipments = async (_req, res) => {
  try {
    const shipments = await Shipment.findAll({ order: [["id", "DESC"]] });
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
    const shipment = await Shipment.findByPk(id);
    if (!shipment) return res.status(404).json({ message: "ไม่พบข้อมูลการจัดส่ง" });
    res.json(shipment);
  } catch (err) {
    console.error("Error fetching shipment:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลการจัดส่งได้" });
  }
};

/* ──────────────── CREATE ──────────────── */
// สร้างข้อมูลการจัดส่งใหม่ (เช่น หลังจากคำสั่งซื้อสำเร็จ)
export const createShipment = async (req, res) => {
  try {
    const { order_id, tracking_number } = req.body;

    if (!order_id) {
      return res.status(400).json({ message: "กรุณาระบุ order_id" });
    }

    const shipment = await Shipment.create({
      order_id,
      tracking_number: tracking_number || null,
      status: "pending",
    });

    res.status(201).json({ message: "สร้างข้อมูลการจัดส่งสำเร็จ", shipment });
  } catch (err) {
    console.error("Error creating shipment:", err);
    res.status(400).json({ message: "ไม่สามารถสร้างข้อมูลการจัดส่งได้" });
  }
};

/* ──────────────── UPDATE ──────────────── */
// อัปเดตสถานะการจัดส่ง (in_transit, delivered)
export const updateShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tracking_number } = req.body;

    const validStatus = ["pending", "in_transit", "delivered"];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({ message: "สถานะไม่ถูกต้อง" });
    }

    const [updated] = await Shipment.update(
      { status, tracking_number },
      { where: { id } }
    );

    if (!updated) return res.status(404).json({ message: "ไม่พบข้อมูลการจัดส่ง" });

    const updatedShipment = await Shipment.findByPk(id);
    res.json({ message: "อัปเดตสถานะการจัดส่งสำเร็จ", shipment: updatedShipment });
  } catch (err) {
    console.error("Error updating shipment:", err);
    res.status(400).json({ message: "ไม่สามารถอัปเดตข้อมูลการจัดส่งได้" });
  }
};

/* ──────────────── DELETE ──────────────── */
// ลบข้อมูลการจัดส่ง
export const deleteShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Shipment.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: "ไม่พบข้อมูลการจัดส่ง" });

    res.json({ message: "ลบข้อมูลการจัดส่งเรียบร้อย" });
  } catch (err) {
    console.error("Error deleting shipment:", err);
    res.status(500).json({ message: "ไม่สามารถลบข้อมูลการจัดส่งได้" });
  }
};
