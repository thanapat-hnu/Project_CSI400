import express from "express";
import {
  getAllShipments,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  deleteShipment,
} from "../../controllers/shipping.Controller.js";

const router = express.Router();

router.get("/", getAllShipments);
router.get("/:id", getShipmentById);
router.post("/", createShipment);
router.put("/:id", updateShipmentStatus);
router.delete("/:id", deleteShipment);

export default router;
