import { Router } from "express"
import JwtAuthMiddleware from "../middleware/jwtAuth.js"
import { authenticate, checkPromoCode, contactUs, getOrders, saveOrder, saveProgress } from "../controllers/base.controller.js"

const baseRouter = Router()

baseRouter.get('/authenticate', JwtAuthMiddleware, authenticate)

baseRouter.post('/save-progress', JwtAuthMiddleware, saveProgress)

baseRouter.post('/save-order', JwtAuthMiddleware, saveOrder)

baseRouter.post('/contact-us', contactUs)

baseRouter.get('/get-orders', JwtAuthMiddleware, getOrders)

baseRouter.post('/check-promocode', checkPromoCode)

export default baseRouter