import express from "express";
import {
  getAllRefunds,
  getRefundById,
  updateRefundStatus,
  deleteRefund,
} from "../../controllers/refund.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();
router.get("/", authJWT, authRole("admin"), getAllRefunds);
router.get("/:id", authJWT, authRole("admin"), getRefundById);
router.put("/:id", authJWT, authRole("admin"), updateRefundStatus);
router.delete("/:id", authJWT, authRole("admin"), deleteRefund);

export default router;
