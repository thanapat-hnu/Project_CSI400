import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const authJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'] 

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'รูปแบบ Authorization header ไม่ถูกต้อง' })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'ไม่พบโทเคนสำหรับยืนยันตัวตน' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        console.error('JWT verification failed:', err.message)
        return res.status(401).json({ message: 'โทเคนไม่ถูกต้องหรือหมดอายุแล้ว' })
    }
}

const authRole = () => {

}

export default authJWT