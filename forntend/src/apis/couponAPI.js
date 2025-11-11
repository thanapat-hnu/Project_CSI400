import axios from "./axios";

/* ──────────────── ADMIN ──────────────── */

// ✅ ดึงคูปองทั้งหมด (Admin)
export const getAllCoupons = () => axios.get("/private/coupon");

// ✅ ดึงคูปองตาม ID (Admin)
export const getCouponById = (id) => axios.get(`/private/coupon/${id}`);

// ✅ สร้างคูปองใหม่ (Admin)
export const createCoupon = (data) => axios.post("/private/coupon", data);

// ✅ เปลี่ยนสถานะ (เปิด/ปิด) (Admin)
export const updateCouponStatus = (id, active) =>
  axios.put(`/private/coupon/${id}`, { active });

// ✅ ลบคูปอง (Admin)
export const deleteCoupon = (id) => axios.delete(`/private/coupon/${id}`);


/* ──────────────── USER ──────────────── */

// ✅ ดึงคูปองที่เปิดใช้งาน (Public)
export const getPublicCoupons = async () => {
  const res = await axios.get("http://localhost:3000/api/public/coupon");
  return res.data;
};

// ✅ เก็บคูปองของผู้ใช้
export const saveUserCoupon = async (couponId) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    "http://localhost:3000/api/protech/coupon/save",
    { coupon_id: couponId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// ✅ ดึงคูปองที่ผู้ใช้เก็บไว้
export const getSavedCoupons = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:3000/api/protech/coupon/saved", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ ใช้คูปอง (Apply coupon)
export const applyCoupon = async (code, total_amount) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    "http://localhost:3000/api/protech/coupon/apply",
    {
      code,
      total_amount,
      user_id: localStorage.getItem("user_id") || null,
      order_id: null,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// ✅ ใช้คูปองจริงหลังชำระเงิน (Redeem)
export const redeemCoupon = async (coupon_id, order_id) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    "http://localhost:3000/api/protech/coupon/redeem",
    { coupon_id, order_id },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// ✅ ทิ้งคูปองหมดอายุ (Discard)
export const discardCoupon = async (coupon_id) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(
    `http://localhost:3000/api/protech/coupon/discard/${coupon_id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
