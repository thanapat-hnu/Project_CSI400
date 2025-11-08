import Coupon from "../models/Coupon.js";
import CouponRedemption from "../models/CouponRedemption.js";
import { sendAutoNotification } from "./notification.Controller.js";

/* ──────────────── GET ──────────────── */
// ✅ ดึงคูปองทั้งหมด
export const getAllCoupons = async (_req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [["id", "ASC"]] });
    res.json(coupons);
  } catch (err) {
    console.error("Error fetching coupons:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลคูปองได้" });
  }
};

// ✅ ดึงคูปองรายตัว
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
    const { code, type, value, start_date, expire_date, min_order_amount } = req.body;

    if (!code || !value) {
      return res.status(400).json({ message: "กรุณาระบุรหัสคูปองและมูลค่าส่วนลด" });
    }

    const exists = await Coupon.findOne({ where: { code } });
    if (exists) {
      return res.status(400).json({ message: "รหัสคูปองนี้ถูกใช้แล้ว" });
    }

    const coupon = await Coupon.create({
      code,
      type: type || "fixed",
      value,
      min_order_amount: min_order_amount || 0,
      active: 1,
      start_date,
      expire_date,
    });

    res.status(201).json({ message: "สร้างคูปองสำเร็จ", coupon });
  } catch (err) {
    console.error("Error creating coupon:", err);
    res.status(400).json({ message: "ไม่สามารถสร้างคูปองได้" });
  }
};

/* ──────────────── UPDATE ──────────────── */
// ✅ อัปเดตสถานะ (เปิด/ปิด)
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
// ✅ ใช้งานคูปอง (ตรวจสอบวัน, ยอดขั้นต่ำ, การใช้ซ้ำ)
export const applyCoupon = async (req, res) => {
  try {
    const { code, user_id, order_id, total_amount } = req.body;

    const coupon = await Coupon.findOne({ where: { code, active: 1 } });
    if (!coupon) return res.status(404).json({ message: "ไม่พบคูปองหรือคูปองถูกปิดใช้งาน" });

    const now = new Date();
    if (coupon.start_date && new Date(coupon.start_date) > now) {
      return res.status(400).json({ message: "คูปองนี้ยังไม่เริ่มใช้งาน" });
    }
    if (coupon.expire_date && new Date(coupon.expire_date) < now) {
      return res.status(400).json({ message: "คูปองนี้หมดอายุแล้ว" });
    }

    // ✅ ตรวจสอบยอดขั้นต่ำ
    if (coupon.min_order_amount && total_amount < coupon.min_order_amount) {
      return res.status(400).json({
        message: `ยอดสั่งซื้อต้องไม่น้อยกว่า ${coupon.min_order_amount.toFixed(2)} บาทเพื่อใช้คูปองนี้`,
      });
    }

    // ✅ ตรวจสอบการใช้ซ้ำ
    const used = await CouponRedemption.findOne({ where: { user_id, coupon_id: coupon.id } });
    if (used) {
      return res.status(400).json({ message: "คุณได้ใช้คูปองนี้ไปแล้ว" });
    }

    // ✅ คำนวณส่วนลด
    const discountAmount = coupon.type === "percent"
      ? (Number(total_amount) * Number(coupon.value)) / 100
      : Number(coupon.value);
    const finalAmount = Math.max(total_amount - discountAmount, 0);

    await CouponRedemption.create({ user_id, coupon_id: coupon.id, order_id });

    // ✅ แจ้งเตือนผู้ใช้
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
    });
  } catch (err) {
    console.error("Error applying coupon:", err);
    res.status(400).json({ message: "ไม่สามารถใช้คูปองได้" });
  }
};

// ✅ ดึงคูปองที่เปิดใช้งาน (สำหรับ Public)
export const getPublicCoupons = async (_req, res) => {
  try {
    const coupons = await Coupon.findAll({
      where: { active: 1 },
      attributes: [
        "id",
        "code",
        "type",
        "value",
        "start_date",
        "expire_date",
        "min_order_amount",
        "active"
      ],
      order: [["id", "DESC"]],
    });

    res.json(coupons);
  } catch (err) {
    console.error("Error fetching public coupons:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลคูปองได้" });
  }
};

// ✅ เก็บคูปองเข้าบัญชีผู้ใช้ (save coupon)
export const saveCoupon = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { coupon_id } = req.body;

    if (!coupon_id) {
      return res.status(400).json({ message: "กรุณาระบุ coupon_id" });
    }

    // ตรวจสอบว่ามีอยู่แล้วไหม
    const exists = await CouponRedemption.findOne({
      where: { user_id, coupon_id, is_saved: true },
    });
    if (exists) {
      return res.status(400).json({ message: "คุณได้เก็บคูปองนี้ไว้แล้ว" });
    }

    // ✅ เก็บคูปอง (บันทึก is_saved)
    const saved = await CouponRedemption.create({
      user_id,
      coupon_id,
      is_saved: true,
      saved_at: new Date(),
    });

    res.status(201).json({ message: "เก็บคูปองเรียบร้อยแล้ว", saved });
  } catch (err) {
    console.error("Error saving coupon:", err);
    res.status(500).json({ message: "ไม่สามารถเก็บคูปองได้" });
  }
};

// ✅ ดึงคูปองที่ผู้ใช้เก็บไว้
export const getSavedCoupons = async (req, res) => {
  try {
    const user_id = req.user.id;
    const savedCoupons = await CouponRedemption.findAll({
      where: { user_id, is_saved: true },
      include: [
        {
          model: Coupon,
          as: "coupon",
          attributes: [
            "id",
            "code",
            "type",
            "value",
            "min_order_amount",
            "start_date",
            "expire_date",
            "active",
          ],
        },
      ],
    });

    if (savedCoupons.length === 0)
      return res.status(200).json({ message: "คุณยังไม่ได้เก็บคูปองใด ๆ", coupons: [] });

    res.json({
      message: "ดึงข้อมูลคูปองที่เก็บไว้สำเร็จ",
      coupons: savedCoupons.map((item) => item.coupon),
    });
  } catch (err) {
    console.error("Error fetching saved coupons:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลคูปองที่เก็บไว้ได้" });
  }
};
