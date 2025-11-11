import { createContext, useEffect, useState } from "react";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
} from "../apis/cartAPI";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 โหลดข้อมูลตะกร้าหลัง Login
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await getCart();
      setCart(res.items || []);
    } catch (err) {
      console.error("❌ โหลดตะกร้าล้มเหลว:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🛒 เพิ่มสินค้า
  const addToCart = async (product_id, quantity = 1) => {
    try {
      await apiAddToCart(product_id, quantity);
      await fetchCart(); // ✅ โหลดตะกร้าใหม่หลังเพิ่มสินค้า
    } catch (err) {
      console.error("❌ เพิ่มสินค้าไม่สำเร็จ:", err);
    }
  };

  // ✏️ แก้จำนวนสินค้า
  const updateCartItem = async (product_id, quantity) => {
    try {
      await apiUpdateCartItem(product_id, quantity);
      await fetchCart(); // ✅ โหลดใหม่หลังอัปเดต
    } catch (err) {
      console.error("❌ อัปเดตจำนวนสินค้าไม่สำเร็จ:", err);
    }
  };

  // ❌ ลบสินค้า
  const removeCartItem = async (product_id) => {
    try {
      await apiRemoveCartItem(product_id);
      setCart((prev) => prev.filter((item) => item.product_id !== product_id)); // ✅ อัปเดตทันที
    } catch (err) {
      console.error("❌ ลบสินค้าไม่สำเร็จ:", err);
    }
  };

  // 🔄 ล้างตะกร้า
  const clearCart = async () => {
    try {
      await apiClearCart();
      setCart([]); // ✅ เคลียร์ใน frontend ด้วย
    } catch (err) {
      console.error("❌ ล้างตะกร้าไม่สำเร็จ:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
