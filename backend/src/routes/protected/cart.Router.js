import express from "express";
import { authJWT } from "../../middlewares/auth.middleware.js";
import {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../controllers/cart.controller.js";

const router = express.Router();

/* ──────────────── CART ROUTES ──────────────── */

// ✅ ดึงตะกร้าของผู้ใช้ (Get My Cart)
router.get("/", authJWT, getMyCart);

// ✅ เพิ่มสินค้าในตะกร้า
router.post("/add", authJWT, addToCart);

// ✅ แก้ไขจำนวนสินค้าในตะกร้า
router.put("/update", authJWT, updateCartItem);

// ✅ ลบสินค้ารายการเดียวออกจากตะกร้า
router.delete("/remove/:product_id", authJWT, removeCartItem);

// ✅ ล้างตะกร้าทั้งหมด
router.delete("/clear", authJWT, clearCart);

export default router;
