// import { saveLog } from '../services/logservice.js'

// export const logger = async (req, res, next) => {
//     const user = req.user?.id || null
//     const action = `${req.method} ${req.originalUrl}`

//     res.on('finish', async () => {
//         const status = res.statusCode >= 400 ? 'FAILED' : 'SUCCESS'

//         await saveLog(
//             user,
//             action,
//             JSON.stringify({
//                 params: req.params,
//                 body: req.body,
//                 query: req.query,
//                 ip: req.ip
//             }),
//             status)
//     })
//     next()
// }

import { saveLog } from '../services/logservice.js'

export const logger = async (req, res, next) => {
    const user = req.user?.id || null
    const action = `${req.method} ${req.originalUrl}`

    res.on('finish', async () => {
        const status = res.statusCode >= 400 ? 'FAILED' : 'SUCCESS'

        // ✅ clone body เพื่อกรองค่าที่ใหญ่เกินไป
        const safeBody = { ...req.body }

        // ❗ ถ้ามี field image และเป็น Base64 ยาวมาก ให้แทนด้วยข้อความ
        if (safeBody.image && typeof safeBody.image === 'string' && safeBody.image.startsWith('data:image')) {
            safeBody.image = '[base64 image omitted]'
        }

        await saveLog(
            user,
            action,
            JSON.stringify({
                params: req.params,
                body: safeBody, 
                query: req.query,
                ip: req.ip
            }),
            status
        )
    })

    next()
}
