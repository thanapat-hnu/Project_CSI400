import bcrypt from 'bcrypt'

import { pool } from '../config/dbpool.js'

export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.user_id

        const [row] = await pool.query(
            ` 
            SELECT email, first_name, last_name, phone
            FROM users
            WHERE id = ?
            `, [userId]
        )

        const { id, name, email, phone, role } = row[0];
        res.status(200).json({
            message: "ดึงข้อมูลผู้ใช้สำเร็จ",
            user: row[0]
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "เกิดข้อผิดพลาดในระบบ"
        })
    }
}

export const updateMyProfile = async (req, res) => {
    try {
        const userId = req.user.user_id
        const { email, first_name, last_name, phone } = req.body

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "ไม่มีข้อมูลที่ส่งมา" })
        }

        if (!email && !first_name && !last_name && !phone) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลอย่างน้อย 1 ช่อง" })
        }

        // ดึงข้อมูลเก่า
        const [userRows] = await pool.query(
            `SELECT email, first_name, last_name, phone FROM users WHERE id = ?`,
            [userId]
        )

        if (userRows.length === 0) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้นี้" })
        }

        const oldData = userRows[0]

        const newEmail = email ?? oldData.email
        const newFirst = first_name ?? oldData.first_name
        const newLast = last_name ?? oldData.last_name
        const newPhone = phone ?? oldData.phone

        const [result] = await pool.query(
            `
            UPDATE users 
            SET email = ?, first_name = ?, last_name = ?, phone = ?
            WHERE id = ?
            `,
            [newEmail, newFirst, newLast, newPhone, userId]
        )

        res.status(200).json({
            message: "อัปเดตข้อมูลสำเร็จ"
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "เกิดข้อผิดพลาดในระบบ"
        })
    }
}


export const changeMyPassword = async (req, res) => {
    try {
        const userId = req.user.user_id
        const { old_password, new_password } = req.body

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "ไม่มีข้อมูลที่ส่งมา" })
        }


        if (!old_password || !new_password) {
            return res.status(400).json({ message: "กรุณากรอกรหัสผ่านเก่าและรหัสผ่านใหม่" })
        }

        const [rows] = await pool.query(
            `
            SELECT password_hash
            FROM users
            WHERE id = ?
            `, [userId]
        )

        if (rows.length === 0) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้นี้" })
        }

        const user = rows[0]

        const isMatch = await bcrypt.compare(old_password, user.password_hash)

        if (!isMatch) {
            return res.status(401).json({ message: "รหัสผ่านเดิมไม่ถูกต้อง" })
        }

        if (old_password === new_password) {
            return res.status(400).json({ message: "รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม" })
        }

        const hashedNewPassword = await bcrypt.hash(new_password, 10)

        await pool.query(
            `
            UPDATE users
            SET password_hash = ?
            WHERE id = ?
            `, [hashedNewPassword, userId]
        )

        return res.status(200).json({
            message: "เปลี่ยนรหัสผ่านสำเร็จ"
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "เกิดข้อผิดพลาดในระบบ"
        })
    }
}


// admin

export const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, email, first_name, last_name, phone, created_at FROM users`
        )

        return res.status(200).json({
            message: "ดึงรายชื่อผู้ใช้สำเร็จ",
            users: rows
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" })
    }
}


export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id

        const [rows] = await pool.query(
            `SELECT id, email, first_name, last_name, phone, created_at FROM users WHERE id = ?`,
            [userId]
        )

        if (rows.length === 0) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้นี้" })
        }

        return res.status(200).json({
            message: "ดึงข้อมูลผู้ใช้สำเร็จ",
            user: rows[0]
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" })
    }
}

export const updateUserById = async (req, res) => {
    try {
        const userId = req.params.id
        const { email, first_name, last_name, phone } = req.body

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "ไม่มีข้อมูลที่ส่งมา" })
        }

        // ดึงข้อมูลเก่า
        const [rows] = await pool.query(
            `SELECT * FROM users WHERE id = ?`,
            [userId]
        )

        if (rows.length === 0) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้นี้" })
        }

        const oldData = rows[0]

        const newEmail = email ?? oldData.email
        const newFirst = first_name ?? oldData.first_name
        const newLast = last_name ?? oldData.last_name
        const newPhone = phone ?? oldData.phone

        await pool.query(
            `UPDATE users SET email = ?, first_name = ?, last_name = ?, phone = ? WHERE id = ?`,
            [newEmail, newFirst, newLast, newPhone, userId]
        )

        return res.status(200).json({
            message: "อัปเดตผู้ใช้สำเร็จ"
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" })
    }
}

export const deleteUserById = async (req, res) => {
    try {
        const userId = req.params.id

        const [rows] = await pool.query(
            `SELECT id FROM users WHERE id = ?`,
            [userId]
        )

        if (rows.length === 0) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้นี้" })
        }

        await pool.query(
            `DELETE FROM users WHERE id = ?`,
            [userId]
        )

        return res.status(200).json({
            message: "ลบผู้ใช้สำเร็จ"
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" })
    }
}