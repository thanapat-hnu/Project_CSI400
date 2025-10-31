import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../config/dbpool.js'

export const registerUser = async (req, res) => {

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "ไม่พบข้อมูลที่ส่งมา" })
    }

    const { email, password, first_name, last_name, phone } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' })
    }

    const emailPattern = /^[A-Za-z0-9._%+-]+@hotmail\.com$/
    if (!emailPattern.test(email)) {
        return res.status(400).json({
            message: "อนุญาตเฉพาะอีเมล Hotmail เท่านั้น เช่น example@hotmail.com"
        });
    }

    try {
        const [existing] = await pool.query(
            `SELECT *
            FROM users
            WHERE email = ?`, [email]
        )
        if (existing.length > 0) {
            return res.status(409).json({ message: 'อีเมลนี้ถูกใช้แล้ว' })
        }

        const hashed = await bcrypt.hash(password, 10)
        const [result] = await pool.query(
            `INSERT INTO users (email, password_hash, first_name, last_name , phone)
            VALUES (?, ?, ?, ?, ?)`, [email, hashed, first_name, last_name, phone]
        )

        const newUserId = result.insertId
        const defaultRoleId = 2

        await pool.query(
            `INSERT INTO user_roles (user_id, role_id)
            VALUES (?,?)`, [newUserId, defaultRoleId]
        )

        res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ', user_id: newUserId })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' })
    }
}

