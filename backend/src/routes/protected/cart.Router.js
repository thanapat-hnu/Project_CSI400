import express from "express";
import { authJWT } from "../../middlewares/auth.middleware.js";
import {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart, 
} from "../../controllers/cart.Controller.js";

const router = express.Router();

// ✅ เส้นทางทั้งหมดของ cart
router.get("/", authJWT, getMyCart);
router.post("/", authJWT, addToCart);
router.put("/", authJWT, updateCartItem);
router.delete("/:product_id", authJWT, removeCartItem);
router.delete("/", authJWT, clearCart); 

export default router;
