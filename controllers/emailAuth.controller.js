import Jwt from 'jsonwebtoken'
import { JwtExpireInMin, JwtSecret } from "../constants.js"
import User from "../models/userModel.js"
import { ResposneHandler, generateOTP } from '../utils.js'
import sendMail from '../emailService.js'

export const verifyEmail = async(req,res) => {
    try {
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
        res.send(ResposneHandler({
            status: 200,
            message: 'Otp sent successfully'
        }))
    } catch(e) {
        console.log(e);
        res.status(500).send(ResposneHandler({
            status: 500,
            statusMessage: "Something went wrong"
        }))
    }
}

export const verifyOtp = async(req,res)=>{
    try {
        const { email, OTP } = req.body
        const existing = await User.findOne({ email })
        if (existing) {
            if (existing.OTP === OTP) {
                const token = Jwt.sign({ userId: existing._id }, JwtSecret, {
                    expiresIn: Number(JwtExpireInMin*60)
                });
                existing.loggedInBy = 'email'
                await existing.save()
                res.send(ResposneHandler({
                    status: 200,
                    message: 'Otp verified successfully',
                    data: {
                        token
                    }
                }))
            } else {
                res.send(ResposneHandler({
                    status: 401,
                    message: 'Unauthorized'
                }))
            }
        } else {
            res.send(ResposneHandler({
                status: 404,
                message: 'Email does not exists'
            }))
        }
    } catch(e) {
        console.log(e);
        res.statusMessage = "Something went wrong";
        res.status(500).end();
    }
}

export const deleteData = async(req,res)=>{
    try {
        const { email } = req.body
        const existing = await User.findOne({ email })
        if (existing) {
            existing.facebookData = null
            existing.googleData = null
            await existing.save()
            res.send(ResposneHandler({
                status: 200,
                message: 'Data deleted successfully',
            }))
        } else {
            res.send(ResposneHandler({
                status: 404,
                message: 'Email does not exists'
            }))
        }
    } catch(e) {
        console.log(e);
        res.statusMessage = "Something went wrong";
        res.status(500).end();
    }
}