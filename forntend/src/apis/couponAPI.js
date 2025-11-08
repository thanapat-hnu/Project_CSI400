import axios from "./axios";

// ✅ ดึงคูปองทั้งหมด
export const getAllCoupons = () => axios.get("/private/coupon");

// ✅ ดึงคูปองตาม ID
export const getCouponById = (id) => axios.get(`/private/coupon/${id}`);

// ✅ สร้างคูปองใหม่
export const createCoupon = (data) => axios.post("/private/coupon", data);

// ✅ เปลี่ยนสถานะ (เปิด/ปิด)
export const updateCouponStatus = (id, active) =>
  axios.put(`/private/coupon/${id}`, { active });

// ✅ ลบคูปอง
export const deleteCoupon = (id) => axios.delete(`/private/coupon/${id}`);

// ✅ ดึงคูปองที่เปิดใช้งาน (Public)
export const getPublicCoupons = async () => {
  const res = await axios.get("http://localhost:3000/api/public/coupon");
  return res.data;
};

// ✅ บันทึกคูปองของผู้ใช้ (เก็บคูปอง)
export const saveUserCoupon = async (couponId) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    "http://localhost:3000/api/private/coupon/save",
    { coupon_id: couponId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// ✅ ดึงคูปองที่ผู้ใช้เก็บไว้
export const getSavedCoupons = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:3000/api/private/coupon/saved", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
