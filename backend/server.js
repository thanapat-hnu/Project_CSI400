import express from "express"
import dotenv from "dotenv"
import cors from 'cors';

import sequelize from './src/config/db.js';
import publicApi from './src/routes/public/public.Router.js'
import protechApi from './src/routes/protected/protected.Router.js'
import privateApi from './src/routes/private/private.Router.js'
import { logger } from './src/middlewares/logger.middleware.js'


dotenv.config()
const app = express()

app.use(cors());
app.use(express.json());
app.use(logger);


const port = process.env.PORT;

app.use('/api/public', publicApi);
app.use('/api/protech', protechApi);
app.use('/api/private', privateApi);
app.use('/uploads', express.static('uploads'));




(async () => {
    try {
        await sequelize.authenticate(); // ทดสอบเชื่อมต่อ
        console.log('✅ Connected to MySQL database');

        // sync models กับ DB (ถ้าไม่อยากให้สร้าง table ใหม่ ให้ระบุ { alter:false, force:false })
        await sequelize.sync({ alter: false });

        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('❌ DB connection failed:', err);
    }
})();
