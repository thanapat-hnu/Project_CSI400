import express from 'express'

const router = express.Router()

router.get('/login', (req, res) => {
    res.json({ message: 'เข้าสู่ระบบ' })
})

export default router
