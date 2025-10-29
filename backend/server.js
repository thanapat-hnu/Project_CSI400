import express from "express"
import dotenv from "dotenv"

import mainRoutes from './src/routes/mainroutes.js'

dotenv.config()
const app = express()
const port = process.env.PORT

app.use(express.json())

app.use('/api', mainRoutes)

app.listen(port, () => {
    console.log(`เซิฟเวอร์กำลังทำงานบน http//:localhost:${port}`)
})