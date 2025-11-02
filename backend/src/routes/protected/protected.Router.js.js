import express from 'express'

import { authJWT } from '../../middlewares/auth.middleware.js'
import { getAddresses, getAddressById, createAddress, updateAddress, deleteAddress } from '../../controllers/address.controller.js'

const router = express.Router()

router.use(authJWT)

// address.controller.js
router.get('/address', getAddresses)
router.get('/address/:id', getAddressById)
router.post('/address', createAddress)
router.put('/address/:id', updateAddress)
router.delete('/address/:id', deleteAddress)


export default router
