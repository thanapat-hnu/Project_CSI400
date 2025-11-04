import express from "express";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../../controllers/order.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// 👑 Admin เท่านั้น
router.get("/", authJWT, authRole("admin"), getAllOrders);
router.get("/:id", authJWT, authRole("admin"), getOrderById);
router.put("/:id", authJWT, authRole("admin"), updateOrderStatus);
router.delete("/:id", authJWT, authRole("admin"), deleteOrder);

export default router;
