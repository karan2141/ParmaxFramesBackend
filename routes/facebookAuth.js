import { Router } from "express";
import { User } from "../model.js";
import Jwt from "jsonwebtoken"
import { JwtExpireInMin, JwtSecret } from "../constants.js";

const facebookRouter = Router()

facebookRouter.post(
    '/facebook',
    async(req,res)=>{
        try {
            const { email, data } = req.body
            if(!data.email_verified) throw "Email not verified"
            const user = await User.findOne({ email })
            let token = ''
            if(!user) {
                const newUser = new User({
                    email,
                    facebookData: data
                })
                await newUser.save()
                token = Jwt.sign({ userId: newUser._id }, JwtSecret, {
                    expiresIn: JwtExpireInMin*60
                });
            } else {
                user.facebookData = data
                await user.save()
                token = Jwt.sign({ userId: user._id }, JwtSecret, {
                    expiresIn: JwtExpireInMin*60
                });
            }
            res.send({
                status: 200,
                message: 'Otp verified successfully',
                data: {
                    email,
                    profilePic: data.picture,
                    token
                }
            })
        } catch (e) {
            console.log('facebook login error --->', JSON.stringify(e))
            res.status(401).json({
                error: new Error('Invalid request!')
            });
        }
    }
)

export default facebookRouter