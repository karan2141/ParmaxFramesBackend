import { Router } from 'express'
import { getOrders, login, setOrderStatus, getOrderImages } from '../controllers/admin.controller.js'
import JwtAuthAdmin from '../middleware/jwtAuthAdmin.js'

const adminRouter = Router()

adminRouter.post('/login', login)

adminRouter.post('/getOrders', JwtAuthAdmin, getOrders)

adminRouter.post('/setOrderStatus', JwtAuthAdmin, setOrderStatus)

adminRouter.post('/getOrderImages', JwtAuthAdmin, getOrderImages)

export default adminRouter