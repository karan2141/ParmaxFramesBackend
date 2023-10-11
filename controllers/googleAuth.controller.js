import Jwt from 'jsonwebtoken'
import { JwtExpireInMin, JwtSecret } from "../constants.js";
import User from "../models/userModel.js";
import { ResposneHandler } from "../utils.js"
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

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
        console.log('here1', isSuccess, idToken);
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        console.log('here2');
        const payload = ticket.getPayload();
        // const userId = payload.sub;
        const userEmail = payload.email;
        // const userName = payload.name;

        const user = await User.findOneAndUpdate({ email: userEmail }, {googleData: payload, loggedInBy: 'google'}, {
            new: true,
            upsert: true
        })
        console.log('here3');
        const token = Jwt.sign({ userId: user.id}, JwtSecret, {
            expiresIn: JwtExpireInMin*60
        })
        
        res.send(ResposneHandler({
            status: 200,
            message: 'Logged in Successfully',
            data: {
                email: userEmail,
                profilePic: payload.picture,
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