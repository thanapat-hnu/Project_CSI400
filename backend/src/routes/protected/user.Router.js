import express from 'express'

import {
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
} from '../../controllers/user.controller.js'

const router = express.Router()

router.get('/', getMyProfile)
router.put('/', updateMyProfile)
router.put('/password', changeMyPassword)


export default router
