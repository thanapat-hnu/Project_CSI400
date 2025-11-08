import Promotion from "../models/Promotion.js";
import fs from "fs";
import path from "path";

/* ─── ดึงโปรโมชั่นทั้งหมด ─── */
export const getAllPromotions = async (_req, res) => {
  try {
    const promos = await Promotion.findAll({ order: [["id", "DESC"]] });
    res.json(promos);
  } catch (err) {
    console.error("❌ Error getAllPromotions:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลโปรโมชั่นได้" });
  }
};

/* ─── สร้างโปรโมชั่นใหม่ ─── */
export const createPromotion = async (req, res) => {
  try {
    console.log("📥 Incoming promotion:", req.body, req.file);

    const { title, description, start_date, end_date } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "กรุณากรอกชื่อและรายละเอียดโปรโมชั่น" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const promo = await Promotion.create({
      title,
      description,
      image,
      start_date,
      end_date,
      active: true,
    });

    console.log("✅ Promotion created:", promo.toJSON());
    return res.status(201).json({ message: "สร้างโปรโมชั่นสำเร็จ", promo });
  } catch (err) {
    console.error("❌ Error creating promotion:", err);
    return res.status(500).json({ message: "ไม่สามารถสร้างโปรโมชั่นได้" });
  }
};

/* ─── เปิด/ปิดโปรโมชั่น ─── */
export const updatePromotionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const promo = await Promotion.findByPk(id);
    if (!promo) return res.status(404).json({ message: "ไม่พบโปรโมชั่น" });

    promo.active = !promo.active;
    await promo.save();
    res.json({ message: "อัปเดตสถานะโปรโมชั่นสำเร็จ", promo });
  } catch (err) {
    console.error("❌ Error updating promotion:", err);
    res.status(500).json({ message: "ไม่สามารถอัปเดตสถานะได้" });
  }
};

/* ─── ลบโปรโมชั่น ─── */
export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const promo = await Promotion.findByPk(id);
    if (!promo) return res.status(404).json({ message: "ไม่พบโปรโมชั่น" });

    if (promo.image && fs.existsSync(path.resolve(`.${promo.image}`))) {
      fs.unlinkSync(path.resolve(`.${promo.image}`));
    }

    await promo.destroy();
    res.json({ message: "ลบโปรโมชั่นสำเร็จ" });
  } catch (err) {
    console.error("❌ Error deleting promotion:", err);
    res.status(500).json({ message: "ไม่สามารถลบโปรโมชั่นได้" });
  }
};
