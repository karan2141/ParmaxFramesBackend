import { Router } from "express"
import { verifyEmail, verifyOtp, deleteData } from "../controllers/emailAuth.controller.js"

const emailAuthRouter = Router()

emailAuthRouter.post('/verify-email', verifyEmail)

emailAuthRouter.post('/verify-otp', verifyOtp)

emailAuthRouter.post('/delete-my-data', deleteData)

export default emailAuthRouter