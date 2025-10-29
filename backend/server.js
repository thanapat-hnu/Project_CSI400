import express from "express"
import dotenv from "dotenv"
import cors from 'cors';


import mainRoutes from './src/routes/mainroutes.js'
import sequelize from './src/config/db.js';
import productRoutes from './src/routes/productRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';

dotenv.config()
const app = express()

app.use(cors());
app.use(express.json());

const port = process.env.PORT

// B
app.use('/api', mainRoutes)

// M
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

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
