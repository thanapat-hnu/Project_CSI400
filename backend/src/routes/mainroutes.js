import express from 'express'

import auth from './public/auth.routes.js'
import Protected from './protected/a.js'
import Private from './private/a.js'

const router = express.Router()

// 🌐 Public routes (ไม่ต้องล็อกอิน)
router.use('/public', auth)

// 🔒 Protected routes (ต้องล็อกอินด้วย JWT)
router.use('/protected', Protected)

// // 🧱 Private routes (เช่น internal/admin เท่านั้น)
router.use('/private/auth', Private)


export default router