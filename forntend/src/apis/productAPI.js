import api from "./axios";

// ✅ ดึงสินค้าทั้งหมด
export const getAllProducts = async () => {
  const res = await api.get("/private/product");
  return res.data;
};

// ✅ เพิ่มสินค้าใหม่
export const createProduct = async (data) => {
  const res = await api.post("/private/product", data);
  return res.data;
};

// ✅ แก้ไขสินค้า
export const updateProduct = async (id, data) => {
  const res = await api.put(`/private/product/${id}`, data);
  return res.data;
};

// ✅ ลบสินค้า
export const deleteProduct = async (id) => {
  const res = await api.delete(`/private/product/${id}`);
  return res.data;
};
