import express from "express";
import {
  getOrdersByUser,
  getOrderById,
  createOrder,
} from "../../controllers/order.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// 🧍 ผู้ใช้ทั่วไป
router.get("/user/:user_id", authJWT, authRole("user", "admin"), getOrdersByUser);
router.get("/:id", authJWT, authRole("user", "admin"), getOrderById);
router.post("/", authJWT, authRole("user", "admin"), createOrder);

export default router;
