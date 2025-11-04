import Coupon from "../models/Coupon.js";
import CouponRedemption from "../models/CouponRedemption.js";
import { sendAutoNotification } from "./notification.Controller.js"; // ✅ เพิ่มสำหรับแจ้งเตือนผู้ใช้
import { Op } from "sequelize";

/* ──────────────── GET ──────────────── */
// ดึงคูปองทั้งหมด
export const getAllCoupons = async (_req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [["id", "ASC"]] });
    res.json(coupons);
  } catch (err) {
    console.error("Error fetching coupons:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลคูปองได้" });
  }
};

// ดึงคูปองตาม ID
export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) return res.status(404).json({ message: "ไม่พบคูปอง" });
    res.json(coupon);
  } catch (err) {
    console.error("Error fetching coupon:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลคูปองได้" });
  }
};

/* ──────────────── CREATE ──────────────── */
// ✅ สร้างคูปองใหม่
export const createCoupon = async (req, res) => {
  try {
    const { code, type, value } = req.body;

    if (!code || !value) {
      return res.status(400).json({ message: "กรุณาระบุ code และ value" });
    }

    const exists = await Coupon.findOne({ where: { code } });
    if (exists) {
      return res.status(400).json({ message: "รหัสคูปองนี้ถูกใช้แล้ว" });
    }

    const coupon = await Coupon.create({
      code,
      type: type || "fixed",
      value,
      active: 1,
    });

    res.status(201).json({ message: "สร้างคูปองสำเร็จ", coupon });
  } catch (err) {
    console.error("Error creating coupon:", err);
    res.status(400).json({ message: "ไม่สามารถสร้างคูปองได้" });
  }
};

/* ──────────────── UPDATE ──────────────── */
// ✅ ปรับสถานะคูปอง
export const updateCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const [updated] = await Coupon.update({ active }, { where: { id } });
    if (!updated) return res.status(404).json({ message: "ไม่พบคูปอง" });

    const updatedCoupon = await Coupon.findByPk(id);
    res.json({ message: "อัปเดตสถานะคูปองสำเร็จ", coupon: updatedCoupon });
  } catch (err) {
    console.error("Error updating coupon:", err);
    res.status(400).json({ message: "ไม่สามารถอัปเดตคูปองได้" });
  }
};

/* ──────────────── DELETE ──────────────── */
// ✅ ลบคูปอง
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "ไม่พบคูปอง" });
    res.json({ message: "ลบคูปองสำเร็จ" });
  } catch (err) {
    console.error("Error deleting coupon:", err);
    res.status(500).json({ message: "ไม่สามารถลบคูปองได้" });
  }
};

/* ──────────────── APPLY ──────────────── */
// ✅ ตรวจสอบและใช้งานคูปอง (เชื่อม Notification)
export const applyCoupon = async (req, res) => {
  try {
    const { code, user_id, order_id, total_amount } = req.body;

    const coupon = await Coupon.findOne({ where: { code, active: 1 } });
    if (!coupon) {
      return res.status(404).json({ message: "ไม่พบคูปองหรือคูปองถูกปิดใช้งาน" });
    }

    // ✅ ตรวจสอบว่าผู้ใช้นี้เคยใช้คูปองนี้หรือยัง
    const used = await CouponRedemption.findOne({
      where: { user_id, coupon_id: coupon.id },
    });
    if (used) {
      return res.status(400).json({ message: "คุณได้ใช้คูปองนี้ไปแล้ว" });
    }

    // ✅ คำนวณส่วนลด
    let discountAmount = 0;
    if (coupon.type === "percent") {
      discountAmount = (Number(total_amount) * Number(coupon.value)) / 100;
    } else {
      discountAmount = Number(coupon.value);
    }

    const finalAmount = Math.max(total_amount - discountAmount, 0);

    // ✅ บันทึกการใช้คูปอง
    const redemption = await CouponRedemption.create({
      user_id,
      coupon_id: coupon.id,
      order_id,
    });

    // ✅ แจ้งเตือนผู้ใช้ว่าใช้คูปองสำเร็จ
    await sendAutoNotification(
      user_id,
      "coupon",
      coupon.id,
      `คุณใช้คูปอง "${coupon.code}" ได้รับส่วนลด ${discountAmount.toFixed(2)} บาท`
    );

    res.json({
      message: "ใช้คูปองสำเร็จ",
      original_total: total_amount,
      discount_amount: discountAmount,
      final_total: finalAmount,
      redemption,
    });
  } catch (err) {
    console.error("Error applying coupon:", err);
    res.status(400).json({ message: "ไม่สามารถใช้คูปองได้" });
  }
};
