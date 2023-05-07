import { Router } from "express"
import { verifyEmail, verifyOtp } from "../controllers/emailAuth.controller.js"

const emailAuthRouter = Router()

emailAuthRouter.post('/verify-email', verifyEmail)

emailAuthRouter.post('/verify-otp', verifyOtp)

export default emailAuthRouter