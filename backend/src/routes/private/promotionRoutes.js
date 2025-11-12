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

/**
 * @swagger
 * tags:
 *   name: โปรโมชั่น
 *   description: "API สำหรับจัดการโปรโมชั่น (ผู้จัดทำ: นายภูวนาท ศรุตติ์ตานนทร์)"
 */

/* ──────────────── Multer Upload ──────────────── */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/**
 * @swagger
 * /api/private/promotion:
 *   get:
 *     summary: ดึงโปรโมชั่นทั้งหมด (Admin)
 *     tags: [โปรโมชั่น]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ดึงโปรโมชั่นสำเร็จ
 */
router.get("/", authJWT, authRole("admin"), getAllPromotions);

/**
 * @swagger
 * /api/private/promotion:
 *   post:
 *     summary: สร้างโปรโมชั่นใหม่ (Admin)
 *     tags: [โปรโมชั่น]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: สร้างโปรโมชั่นสำเร็จ
 */
router.post("/", authJWT, authRole("admin"), upload.single("image"), createPromotion);

/**
 * @swagger
 * /api/private/promotion/{id}:
 *   put:
 *     summary: เปิด/ปิดโปรโมชั่น (Admin)
 *     tags: [โปรโมชั่น]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID ของโปรโมชั่น
 *     responses:
 *       200:
 *         description: อัปเดตสถานะโปรโมชั่นสำเร็จ
 */
router.put("/:id", authJWT, authRole("admin"), updatePromotionStatus);

/**
 * @swagger
 * /api/private/promotion/{id}:
 *   delete:
 *     summary: ลบโปรโมชั่น (Admin)
 *     tags: [โปรโมชั่น]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID ของโปรโมชั่น
 *     responses:
 *       200:
 *         description: ลบโปรโมชั่นสำเร็จ
 */
router.delete("/:id", authJWT, authRole("admin"), deletePromotion);

export default router;
