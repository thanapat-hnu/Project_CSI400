import express from "express";
import {
  getShipmentById,
} from "../../controllers/shipping.Controller.js";

const router = express.Router();


router.get("/:id", getShipmentById);

export default router;
