import express from "express";
import multer from "multer";
import {
  getAllPromotions,
  createPromotion,
  updatePromotionStatus,
  deletePromotion,
} from "../../controllers/promotion.Controller.js";
import { authJWT, authRole } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// 📦 ตั้งค่า upload เก็บรูปโปรโมชั่น
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/* ──────────────── ADMIN ──────────────── */
router.get("/", authJWT, authRole("admin"), getAllPromotions);
router.post("/", authJWT, authRole("admin"), upload.single("image"), createPromotion);
router.put("/:id", authJWT, authRole("admin"), updatePromotionStatus);
router.delete("/:id", authJWT, authRole("admin"), deletePromotion);

export default router;
