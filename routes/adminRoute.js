import { Router } from 'express'
import { getOrders, login } from '../controllers/admin.controller.js'
import JwtAuthAdmin from '../middleware/jwtAuthAdmin.js'

const adminRouter = Router()

adminRouter.post('/login', login)

adminRouter.get('/getOrders', JwtAuthAdmin, getOrders)

export default adminRouter