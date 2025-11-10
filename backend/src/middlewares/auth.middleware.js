import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const authJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.status(401).json({ message: 'ไม่พบ Authorization header' });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'รูปแบบ Authorization header ไม่ถูกต้อง' })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'ไม่พบโทเคนสำหรับยืนยันตัวตน' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        console.log('Authenticated user:', req.user)
        next()
    } catch (err) {
        console.error('JWT verification failed:', err.message)
        return res.status(401).json({ message: 'โทเคนไม่ถูกต้องหรือหมดอายุแล้ว' })
    }
}

const authRole = (role) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles) {
            return res.status(403).json({ message: 'ไม่พบสิทธิ์ของผู้ใช้' });
        }

        if (req.user.roles === role) {
            return next()
        }

        return res.status(403).json({ message: 'ผู้ใช้ไม่มีสิทธิ์เข้าถึงหน้าที่ต้องการ' });
    }
}

export { authJWT, authRole }