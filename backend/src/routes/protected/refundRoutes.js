import express from "express";
import {
  getRefundById,
  createRefund,
} from "../../controllers/refund.Controller.js";
import { authJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ──────────────── USER ──────────────── */
router.get("/:id", authJWT, getRefundById);
router.post("/", authJWT, createRefund);

export default router;
