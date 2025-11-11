import Coupon from "../models/Coupon.js";
import CouponRedemption from "../models/CouponRedemption.js";
import { sendAutoNotification } from "./notification.Controller.js";

/* ──────────────── GET ──────────────── */
// ✅ ดึงคูปองทั้งหมด (Admin)
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
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ message: "ไม่พบคูปอง" });
    res.json(coupon);
  } catch (err) {
    console.error("Error fetching coupon:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลคูปองได้" });
  }
};

/* ──────────────── CREATE ──────────────── */
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
export const updateCouponStatus = async (req, res) => {
  try {
    const [updated] = await Coupon.update({ active: req.body.active }, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: "ไม่พบคูปอง" });

    const updatedCoupon = await Coupon.findByPk(req.params.id);
    res.json({ message: "อัปเดตสถานะคูปองสำเร็จ", coupon: updatedCoupon });
  } catch (err) {
    console.error("Error updating coupon:", err);
    res.status(400).json({ message: "ไม่สามารถอัปเดตคูปองได้" });
  }
};

/* ──────────────── DELETE ──────────────── */
export const deleteCoupon = async (req, res) => {
  try {
    const deleted = await Coupon.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "ไม่พบคูปอง" });
    res.json({ message: "ลบคูปองสำเร็จ" });
  } catch (err) {
    console.error("Error deleting coupon:", err);
    res.status(500).json({ message: "ไม่สามารถลบคูปองได้" });
  }
};

/* ──────────────── APPLY (ตรวจสอบก่อนใช้) ──────────────── */
export const applyCoupon = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { code, total_amount } = req.body;

    const coupon = await Coupon.findOne({ where: { code, active: 1 } });
    if (!coupon) return res.status(404).json({ message: "ไม่พบคูปองหรือถูกปิดใช้งาน" });

    const now = new Date();
    if (coupon.start_date && new Date(coupon.start_date) > now)
      return res.status(400).json({ message: "คูปองนี้ยังไม่เริ่มใช้งาน" });
    if (coupon.expire_date && new Date(coupon.expire_date) < now)
      return res.status(400).json({ message: "คูปองนี้หมดอายุแล้ว" });

    if (coupon.min_order_amount && total_amount < coupon.min_order_amount)
      return res.status(400).json({
        message: `ยอดสั่งซื้อต้องไม่น้อยกว่า ${coupon.min_order_amount.toFixed(2)} บาท`,
      });

    const used = await CouponRedemption.findOne({
      where: { user_id, coupon_id: coupon.id, is_saved: false },
    });
    if (used) return res.status(400).json({ message: "คุณได้ใช้คูปองนี้ไปแล้ว" });

    const discountAmount =
      coupon.type === "percent"
        ? (Number(total_amount) * Number(coupon.value)) / 100
        : Number(coupon.value);
    const finalAmount = Math.max(total_amount - discountAmount, 0);

    // ✅ แค่ตรวจสอบเท่านั้น ยังไม่บันทึกการใช้
    res.json({
      message: "คูปองนี้สามารถใช้ได้",
      discount_amount: discountAmount,
      final_total: finalAmount,
      coupon_id: coupon.id,
      code: coupon.code,
    });
  } catch (err) {
    console.error("Error validating coupon:", err);
    res.status(400).json({ message: "ไม่สามารถตรวจสอบคูปองได้" });
  }
};

/* ──────────────── REDEEM (ใช้จริงหลังจ่ายเงิน) ──────────────── */
export const redeemCoupon = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { coupon_id, order_id } = req.body;

    const coupon = await Coupon.findByPk(coupon_id);
    if (!coupon) return res.status(404).json({ message: "ไม่พบคูปอง" });

    const exists = await CouponRedemption.findOne({
      where: { user_id, coupon_id, is_saved: false },
    });
    if (exists) return res.status(400).json({ message: "คุณได้ใช้คูปองนี้ไปแล้ว" });

    await CouponRedemption.create({
      user_id,
      coupon_id,
      order_id,
      is_saved: false,
      used_at: new Date(),
    });

    await sendAutoNotification(
      user_id,
      "coupon",
      coupon.id,
      `คุณใช้คูปอง "${coupon.code}" เรียบร้อยแล้ว`
    );

    res.json({ message: "✅ บันทึกการใช้คูปองเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("Error redeeming coupon:", err);
    res.status(500).json({ message: "ไม่สามารถบันทึกการใช้คูปองได้" });
  }
};

/* ──────────────── PUBLIC ──────────────── */
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
        "active",
      ],
      order: [["id", "DESC"]],
    });
    res.json(coupons);
  } catch (err) {
    console.error("Error fetching public coupons:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลคูปองได้" });
  }
};

/* ──────────────── SAVE ──────────────── */
export const saveCoupon = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { coupon_id } = req.body;

    if (!coupon_id) {
      return res.status(400).json({ message: "กรุณาระบุ coupon_id" });
    }

    // 🔎 ตรวจสอบว่าผู้ใช้เคยใช้คูปองนี้ไปแล้วหรือไม่
    const usedBefore = await CouponRedemption.findOne({
      where: { user_id, coupon_id, is_saved: false },
    });
    if (usedBefore) {
      return res.status(400).json({ message: "คุณเคยใช้คูปองนี้ไปแล้ว ไม่สามารถเก็บได้อีก" });
    }

    // 🔎 ตรวจสอบว่ามีอยู่แล้วใน Saved หรือยัง
    const exists = await CouponRedemption.findOne({
      where: { user_id, coupon_id, is_saved: true },
    });
    if (exists) {
      return res.status(400).json({ message: "คุณได้เก็บคูปองนี้ไว้แล้ว" });
    }

    // ✅ ถ้าไม่เคยใช้และยังไม่เคยเก็บ -> บันทึกใหม่
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

/* ──────────────── GET SAVED / USED ──────────────── */
// ✅ ดึงคูปองที่ผู้ใช้เก็บไว้ (เฉพาะที่ยังไม่ได้ใช้)
export const getSavedCoupons = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const savedCoupons = await CouponRedemption.findAll({
      where: {
        user_id,
        is_saved: true,        // ยังเก็บไว้
        used_at: null,         // ❗ ยังไม่ถูกใช้
      },
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
      order: [["saved_at", "DESC"]],
    });

    // ✅ กรองออกหากคูปองหมดอายุแล้ว
    const now = new Date();
    const validCoupons = savedCoupons.filter((item) => {
      const exp = item.coupon.expire_date
        ? new Date(item.coupon.expire_date)
        : null;
      return !exp || exp >= now;
    });

    if (validCoupons.length === 0) {
      return res
        .status(200)
        .json({ message: "คุณยังไม่ได้เก็บคูปองใด ๆ", coupons: [] });
    }

    res.json({
      message: "ดึงข้อมูลคูปองที่เก็บไว้สำเร็จ",
      coupons: validCoupons.map((item) => item.coupon),
    });
  } catch (err) {
    console.error("Error fetching saved coupons:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลคูปองที่เก็บไว้ได้" });
  }
};

export const getUsedCoupons = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const usedCoupons = await CouponRedemption.findAll({
      where: { user_id, is_saved: false },
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
      order: [["used_at", "DESC"]],
    });

    res.json({
      message: "ดึงข้อมูลคูปองที่ใช้แล้วสำเร็จ",
      coupons: usedCoupons.map((r) => r.coupon),
    });
  } catch (err) {
    console.error("Error fetching used coupons:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลคูปองที่ใช้แล้วได้" });
  }
};

// ✅ ลบคูปองที่หมดอายุออกจากบัญชีผู้ใช้ (Discard)
export const discardCoupon = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { coupon_id } = req.params;

    // ตรวจสอบว่าคูปองมีอยู่จริงและเป็นของผู้ใช้
    const record = await CouponRedemption.findOne({
      where: { user_id, coupon_id, is_saved: true },
    });

    if (!record) {
      return res.status(404).json({ message: "ไม่พบคูปองที่ต้องการลบ" });
    }

    // ตรวจสอบว่าคูปองหมดอายุแล้วหรือยัง
    const coupon = await Coupon.findByPk(coupon_id);
    const now = new Date();
    if (coupon && coupon.expire_date && new Date(coupon.expire_date) > now) {
      return res
        .status(400)
        .json({ message: "คูปองยังไม่หมดอายุ ไม่สามารถทิ้งได้" });
    }

    // ✅ ลบออกจากตาราง CouponRedemption
    await record.destroy();

    res.json({ message: "🗑️ ลบคูปองหมดอายุออกเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("Error discarding coupon:", err);
    res.status(500).json({ message: "ไม่สามารถลบคูปองได้" });
  }
};
