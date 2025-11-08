import axios from "axios";

const API_URL = "http://localhost:3000/api/private/promotion";

// ✅ แนบ token ทุกครั้ง
const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// ✅ ดึงโปรโมชั่นทั้งหมด
export const getAllPromotions = async () => {
  const res = await api.get("/");
  return res.data;
};

// ✅ เพิ่มโปรโมชั่นใหม่
export const createPromotion = async (formData) => {
  const res = await api.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ✅ เปิด/ปิดโปรโมชั่น
export const togglePromotionStatus = async (id, active) => {
  const res = await api.put(`/${id}`, { active });
  return res.data;
};

// ✅ ลบโปรโมชั่น
export const deletePromotion = async (id) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};

// ✅ ดึงโปรโมชั่นแบบสาธารณะ (ไม่ต้องล็อกอิน)
export const getPublicPromotions = async () => {
  const res = await axios.get("http://localhost:3000/api/public/promotion");
  return res.data;
};
