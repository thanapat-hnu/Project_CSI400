import express from 'express'

import { registerUser, loginUser } from '../../controllers/authController.js'
import { authJWT, authRole } from '../../middlewares/auth.middleware.js'
import { logger } from '../../middlewares/logger.middleware.js'

const router = express.Router()

router.use(logger)

router.post('/register', registerUser)
router.post('/login', loginUser)

router.get('/test', authJWT, authRole('user'), (req, res) => {
    res.json({ message: "Test OK" })
})


export default router
