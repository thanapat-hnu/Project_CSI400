import express from "express";
import Promotion from "../../models/Promotion.js";
import { Op } from "sequelize";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: โปรโมชั่น
 *   description: "API จัดการโปรโมชั่น (ผู้จัดทำ: นายภูวนาท ศรุตติ์ตานนทร์)"
 */

/**
 * @swagger
 * /api/public/promotion:
 *   get:
 *     summary: ดึงโปรโมชั่นทั้งหมดที่ active
 *     description: คืนค่าข้อมูลโปรโมชั่นที่ active และยังไม่หมดอายุ
 *     tags: [โปรโมชั่น]
 *     responses:
 *       200:
 *         description: ดึงโปรโมชั่นสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   start_date:
 *                     type: string
 *                     format: date
 *                   end_date:
 *                     type: string
 *                     format: date
 *                   active:
 *                     type: boolean
 *       500:
 *         description: เกิดข้อผิดพลาด
 */

// ✅ ดึงเฉพาะโปรโมชั่นที่ active และยังไม่หมดอายุ
router.get("/", async (req, res) => {
  try {
    const promotions = await Promotion.findAll({
      where: {
        active: true,
        end_date: { [Op.gte]: new Date() },
      },
      order: [["start_date", "DESC"]],
    });
    res.json(promotions);
  } catch (err) {
    console.error("Error fetching public promotions:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลโปรโมชั่นได้" });
  }
});

export default router;
