import Jwt from "jsonwebtoken"
import { JwtExpireInMin, JwtSecret } from "../constants.js";
import User from "../models/userModel.js";
import { ResposneHandler } from "../utils.js"

export const facebook = async(req,res)=>{
    try {
        const { email, data } = req.body
        const user = await User.findOneAndUpdate({ email }, {facebookData: data, loggedInBy: 'facebook'}, {
            new: true,
            upsert: true
        })
        const token = Jwt.sign({ userId: user.id}, JwtSecret, {
            expiresIn: JwtExpireInMin*60
        })
        
        res.send(ResposneHandler({
            status: 200,
            message: 'Logged in Successfully',
            data: {
                email,
                profilePic: data.picture.data.url,
                token
            }
        }))
    } catch (e) {
        console.log('facebook login error --->', JSON.stringify(e))
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
}