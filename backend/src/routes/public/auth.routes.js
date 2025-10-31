import express from 'express'

import { registerUser, loginUser } from '../../controllers/authController.js'
import { authJWT } from '../../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/test', authJWT, (req, res) => {
    console.log("010230128")
})


export default router
