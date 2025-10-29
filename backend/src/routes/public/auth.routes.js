import express from 'express'

const router = express.Router()

router.post('/login', (req, res) => {
    res.json({ message: 'เข้าสู่ระบบ' })
})

router.post('/register', (req, res) => {
    res.json({ message: 'เข้าสู่ระบบ' })
})

export default router
