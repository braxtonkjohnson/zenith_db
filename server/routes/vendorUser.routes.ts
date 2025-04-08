import express from 'express'
import { loginVendorUser } from '../controllers/vendorUser.controller'

const router = express.Router()

router.post('/login', loginVendorUser)

export default router
