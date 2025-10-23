// server.js
import dotenv from 'dotenv';
import app from './src/app.js';
import sequelize from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate(); // ทดสอบเชื่อมต่อ
    console.log('✅ Connected to MySQL database');
    
    // sync models กับ DB (ถ้าไม่อยากให้สร้าง table ใหม่ ให้ระบุ { alter:false, force:false })
    await sequelize.sync({ alter: false });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ DB connection failed:', err);
  }
})();
