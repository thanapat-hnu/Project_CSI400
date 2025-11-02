import express from "express";
import {
  getAllRefunds,
  getRefundById,
  updateRefundStatus,
  deleteRefund,
} from "../../controllers/refund.Controller.js";

const router = express.Router();

router.get("/", getAllRefunds);
router.get("/:id", getRefundById);
router.put("/:id", updateRefundStatus);
router.delete("/:id", deleteRefund);

export default router;
