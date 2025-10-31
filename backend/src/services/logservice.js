import { pool } from '../config/dbpool.js'

export const saveLog = async (userId = null, action, detail = {}, status = 'SUCCESS') => {
    try {
        await pool.execute(
            `INSERT INTO system_logs (user_id, action, detail, status)
             VALUES (?, ?, ?, ?)`,
            [
                userId,
                action,
                JSON.stringify(detail),
                status
            ]
        )
    } catch (err) {
        console.error("Error saving log:", err.message);
    }
}