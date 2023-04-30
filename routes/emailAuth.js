import { Router } from "express"
import { generateOTP } from "../utils.js"
import sendMail from "../emailService.js"
import Jwt from 'jsonwebtoken'
import { JwtExpireInMin, JwtSecret } from "../constants.js"
import User from "../models/userModel.js"

const emailAuthRouter = Router()

emailAuthRouter.post('/verify-email',async(req,res) => {
    try{
        const { email } = req.body
        const existing = await User.findOne({ email })
        const OTP = generateOTP()
        if(!existing) {
            const user = new User({
                email,
                OTP
            })
            await user.save()
        } else {
            await User.updateOne({email}, {OTP})
        }
        await sendMail({ to: email, OTP })
        res.send({
            status: 200,
            message: 'Otp sent successfully'
        })
    } catch(e) {
        console.log(e);
        res.statusMessage = "Something went wrong";
        res.status(500).end();
    }
})

emailAuthRouter.post('/verify-otp', async(req,res)=>{
    try {
        const { email, OTP } = req.body
        const existing = await User.findOne({ email })
        if (existing) {
            if (existing.OTP === OTP) {
                const token = Jwt.sign({ userId: existing._id }, JwtSecret, {
                    expiresIn: Number(JwtExpireInMin*60)
                });
                res.send({
                    status: 200,
                    message: 'Otp verified successfully',
                    data: {
                        token
                    }
                })
            } else {
                res.send({
                    status: 401,
                    message: 'Unauthorized'
                })
            }
        } else {
            res.send({
                status: 404,
                message: 'Email does not exists'
            })
        }
    } catch(e) {
        console.log(e);
        res.statusMessage = "Something went wrong";
        res.status(500).end();
    }
})

export default emailAuthRouter