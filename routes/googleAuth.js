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
            console.log('here 1');
            const user = await User.findOneAndUpdate({ email }, {googleData: data}, {
                new: true,
                upsert: true
            })
            console.log('here 2');
            const token = Jwt.sign({ userId: user._id }, JwtSecret, {
                expiresIn: JwtExpireInMin*60
            });
            console.log('here 3', token);

            const final = {
                email,
                profilePic: data.picture,
                token
            }

            console.log('here 4', final);
            // if(!user) {
            //     const newUser = new User({
            //         email,
            //         googleData: data
            //     })
            //     await newUser.save()
            //     console.log('here 3');
            //     token = Jwt.sign({ userId: newUser._id }, JwtSecret, {
            //         expiresIn: JwtExpireInMin*60
            //     });
            //     console.log('here 4');
            // } else {
            //     console.log('here 5');
            //     user.googleData = data
            //     await user.save()
            //     console.log('here 6', JSON.stringify());
            //     token = Jwt.sign({ userId: user._id }, JwtSecret, {
            //         expiresIn: JwtExpireInMin*60
            //     });
            //     console.log('here 7');
            // }
            // console.log(JSON.stringify(data));
            res.send({
                status: 200,
                message: 'Otp verified successfully',
                data: final
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