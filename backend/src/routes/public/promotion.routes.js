import express from "express";
import Promotion from "../../models/Promotion.js";
import { Op } from "sequelize";

const router = express.Router();

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
