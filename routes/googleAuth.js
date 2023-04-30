import { Router } from "express";
import { User } from "../model.js";
import Jwt from "jsonwebtoken"
import { JwtExpireInMin, JwtSecret } from "../constants.js";

const googleRouter = Router()

googleRouter.post(
    '/google',
    async(req,res)=>{
        try {
            const { email, data } = req.body
            if(!data.email_verified) throw "Email not verified"
            console.log('here');
            const user = await User.findOne({ email })
            console.log('here');
            let token = ''
            console.log('here');
            if(!user) {
                const newUser = new User({
                    email,
                    googleData: data
                })
                console.log('here');
                await newUser.save()
                token = Jwt.sign({ userId: newUser._id }, JwtSecret, {
                    expiresIn: JwtExpireInMin*60
                });
                console.log('here');
            } else {
                console.log('here');
                user.googleData = data
                await user.save()
                console.log('here', user);
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
            console.log('google login error --->', JSON.stringify(e))
            res.status(401).json({
                error: new Error('Invalid request!')
            });
        }
    }
)

export default googleRouter