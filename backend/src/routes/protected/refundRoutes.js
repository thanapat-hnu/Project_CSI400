import express from "express";
import {
  getRefundById,
  createRefund,
} from "../../controllers/refund.Controller.js";

const router = express.Router();

router.get("/:id", getRefundById);
router.post("/", createRefund);

export default router;
