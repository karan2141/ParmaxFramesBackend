import Jwt from 'jsonwebtoken'
import { JwtExpireInMin, JwtSecret } from "../constants.js";
import User from "../models/userModel.js";
import { ResposneHandler } from "../utils.js"

export const google = async(req,res)=>{
    try {
        const { email, data } = req.body
        const user = await User.findOneAndUpdate({ email }, {googleData: data, loggedInBy: 'google'}, {
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
                profilePic: data.picture,
                token
            }
        }))
    } catch (e) {
        console.log('google login error --->', JSON.stringify(e))
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
}

export const mobilegoogle = async(req,res)=>{
    try {
        const { isSuccess, idToken, type } = req.body
        const response = await axios.post(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
        const userInfo = response.data;

        const user = await User.findOneAndUpdate({ email: userInfo.email }, {googleData: userInfo, loggedInBy: 'google'}, {
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
                email: userInfo.email,
                profilePic: userInfo.picture,
                token
            }
        }))
    } catch (e) {
        console.log('mobile google login error --->', JSON.stringify(e))
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
}