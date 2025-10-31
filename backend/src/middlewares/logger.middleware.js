import { saveLog } from '../services/logservice.js'

export const logger = async (req, res, next) => {
    const user = req.user?.id || null
    const action = `${req.method} ${req.originalUrl}`

    res.on('finish', async () => {
        const status = res.statusCode >= 400 ? 'FAILED' : 'SUCCESS'

        await saveLog(
            user,
            action,
            JSON.stringify({
                params: req.params,
                body: req.body,
                query: req.query,
                ip: req.ip
            }),
            status)
    })
    next()
}