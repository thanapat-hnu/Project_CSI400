import { pool } from '../config/dbpool.js'


// ดึงที่อยู่ทั้งหมดของผู้ใช้
export const getAddresses = async (req, res) => {

    try {

        const userId = req.user.user_id

        const [rows] = await pool.query(
            `
        SELECT  id, address_line, city, province, postal_code, phone
        FROM    addresses
        WHERE   user_id = ?
        `, [userId]
        )

        if (rows.length === 0) {
            return res.status(200).json({ message: "ไม่พบที่อยู่ในระบบ" })
        }

        res.status(200).json({
            message: "ดึงข้อมูลที่อยู่สำเร็จ",
            addresses: rows
        })

    } catch (err) {

        console.error(err)
        return res.status(500).json({
            message: "เกิดข้อผิดพลาดในระบบ"
        })

    }

}

// ดึงที่อยู่ตาม ID (ใช้ตอนดูรายละเอียดที่อยู่เฉพาะรายการ)
export const getAddressById = async (req, res) => {
    try {

        const addressId = req.params.id
        const userId = req.user.user_id

        const [rows] = await pool.query(
            `
        SELECT  id, address_line, city, province, postal_code, phone
        FROM    addresses
        WHERE   id = ? AND user_id = ?
        `, [addressId, userId]
        )

        if (rows.length === 0) {
            return res.status(200).json({ message: "ไม่พบที่อยู่ในระบบ" })
        }

        res.status(200).json({
            message: "ดึงข้อมูลที่อยู่สำเร็จ",
            addresses: rows
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "เกิดข้อผิดพลาดในระบบ"
        })

    }

}

// เพิ่มที่อยู่ใหม่
export const createAddress = async (req, res) => {
    try {
        const userId = req.user.user_id
        const { addressLine, city, province, postalCode, phone } = req.body

        const requiredFields = [addressLine, city, province, postalCode, phone]
        if (requiredFields.some(field => !field || field.trim() === "")) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ เช่น ที่อยู่, อำเภอ, จังหวัด, รหัสไปรษณีย์, เบอร์โทร" })
        }

        if (!/^\d{5}$/.test(postalCode)) {
            return res.status(400).json({ message: "รหัสไปรษณีย์ไม่ถูกต้อง" })
        }

        if (!/^\d{9,10}$/.test(phone)) {
            return res.status(400).json({ message: "เบอร์โทรไม่ถูกต้อง" })
        }

        const [result] = await pool.query(
            `
            INSERT INTO addresses( user_id, address_line, city, province, postal_code,phone )
            VALUES (?,?,?,?,?,?)
            `, [userId, addressLine, city, province, postalCode, phone]
        )

        return res.status(201).json({
            message: "เพิ่มที่อยู่สำเร็จ",
            addressId: result.insertId
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "เกิดข้อผิดพลาดในระบบ"
        })
    }
}

// แก้ไขที่อยู่
export const updateAddress = async (req, res) => {
    try {
        const userId = req.user.user_id
        const addressId = req.params.id
        const { addressLine, city, province, postalCode, phone } = req.body

        const requiredFields = [addressLine, city, province, postalCode, phone]
        if (requiredFields.some(field => !field || field.trim() === "")) {
            return res.status(400).json({
                message: "กรุณากรอกข้อมูลให้ครบ เช่น ที่อยู่, อำเภอ, จังหวัด, รหัสไปรษณีย์, เบอร์โทร"
            })
        }

        if (!/^\d{5}$/.test(postalCode)) {
            return res.status(400).json({ message: "รหัสไปรษณีย์ไม่ถูกต้อง" })
        }

        if (!/^\d{9,10}$/.test(phone)) {
            return res.status(400).json({ message: "เบอร์โทรไม่ถูกต้อง" })
        }

        const [existing] = await pool.query(
            `
            SELECT id
            FROM addresses 
            WHERE id = ? AND user_id = ?
            `, [addressId, userId]
        )

        if (existing.length === 0) {
            return res.status(404).json({ message: "ไม่พบที่อยู่นี้ หรือคุณไม่มีสิทธิ์แก้ไข" })
        }

        await pool.query(
            `UPDATE addresses
             SET address_line = ?, city = ?, province = ?, postal_code = ?, phone = ?
             WHERE id = ? AND user_id = ?`,
            [addressLine, city, province, postalCode, phone, addressId, userId]
        )

        return res.status(200).json({ message: "แก้ไขที่อยู่สำเร็จ" })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "เกิดข้อผิดพลาดในระบบ"
        })
    }
}

// ลบที่อยู่
export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.user_id
        const addressId = req.params.id

        const [existing] = await pool.query(
            `SELECT id 
            FROM addresses 
            WHERE id = ? AND user_id = ?
            `, [addressId, userId]
        )

        if (existing.length === 0) {
            return res.status(404).json({
                message: "ไม่พบที่อยู่นี้ หรือคุณไม่มีสิทธิ์ลบ"
            })
        }

        await pool.query(
            `DELETE FROM addresses WHERE id = ? AND user_id = ?`,
            [addressId, userId]
        )

        return res.status(200).json({
            message: "ลบที่อยู่สำเร็จ"
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "เกิดข้อผิดพลาดในระบบ"
        })
    }
}