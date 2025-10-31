import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../config/dbpool.js'
import dotenv from 'dotenv'

dotenv.config()

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

export const loginUser = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "ไม่พบข้อมูลที่ส่งมา" })
    }

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" })
    }

    try {
        const [rows] = await pool.query(
            `SELECT *
            FROM users
            WHERE email = ?`, [email]
        )

        if (rows.length === 0) {
            return res.status(401).json({ message: "ไม่พบผู้ใช้นี้ในระบบ" })
        }

        const user = rows[0]

        const isMatch = await bcrypt.compare(password, user.password_hash)
        if (!isMatch) {
            return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" })
        }

        const [roles] = await pool.query(
            `SELECT r.name
            FROM roles r
            JOIN user_roles ur ON ur.role_id = r.id
            WHERE ur.user_id = ?`, [user.id]
        )

        const roleNames = roles.map(r => r.name);

        const token = jwt.sign(
            {
                user_id: user.id,
                email: user.email,
                roles: roleNames
            },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
        )

        res.status(200).json({
            message: "เข้าสู่ระบบสำเร็จ",
            token
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
    }

    if (!email && !password) {
        return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" })
    }
}