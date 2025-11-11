import api from "./axios";

// 🟢 ดึงข้อมูลตะกร้าของผู้ใช้
export const getCart = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/protech/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🟢 เพิ่มสินค้าในตะกร้า
export const addToCart = async (product_id, quantity = 1) => {
  const token = localStorage.getItem("token");
  const res = await api.post(
    "/protech/cart/add",
    { product_id, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// 🟢 อัปเดตจำนวนสินค้า
export const updateCartItem = async (product_id, quantity) => {
  const token = localStorage.getItem("token");
  const res = await api.put(
    "/protech/cart/update",
    { product_id, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// 🟢 ลบสินค้าออกจากตะกร้า
export const removeCartItem = async (product_id) => {
  const token = localStorage.getItem("token");
  const res = await api.delete(`/protech/cart/remove/${product_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🟢 ล้างตะกร้าทั้งหมด
export const clearCart = async () => {
  const token = localStorage.getItem("token");
  const res = await api.delete("/protech/cart/clear", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
