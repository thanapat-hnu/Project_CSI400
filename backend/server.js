import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./src/config/db.js";

import publicApi from "./src/routes/public/public.Router.js";
import protechApi from "./src/routes/protected/protected.Router.js";
import privateApi from "./src/routes/private/private.Router.js";
import { logger } from "./src/middlewares/logger.middleware.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// ✅ เสิร์ฟไฟล์ภาพจากโฟลเดอร์ uploads
app.use("/uploads", express.static("uploads"));

app.use("/api/public", publicApi);
app.use("/api/protech", protechApi);
app.use("/api/private", privateApi);

const port = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL database");

    await sequelize.sync({ alter: false });
    // await sequelize.sync({ alter: true }); // ✅ อนุญาตให้ Sequelize ปรับโครงสร้างตาราง

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
})();
