import express from 'express'
import connectMongoDb from './mongoConfig.js'
import bodyParser from 'body-parser'
import { User } from './model.js'
import chalk from 'chalk'
import { generateOTP } from './utils.js'
import sendMail from './emailService.js'
import Jwt from 'jsonwebtoken'
import cors from 'cors';

const JwtSecret = process.env.SECRET

connectMongoDb()

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());

app.post('/verify-email',async(req,res) => {
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
        const result = await sendMail({ to: email, OTP })
        console.log(result, 'emailsent');
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

app.post('/verify-otp', async(req,res)=>{
    try {
        const { email, OTP } = req.body
        const existing = await User.findOne({ email })
        if (existing) {
            if (existing.OTP === OTP) {
                const token = Jwt.sign({ email,  }, JwtSecret, {
                    expiresIn: "6000s"
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

const port = process.env.PORT || 8080
app.listen(port, ()=>{
    console.log(chalk.green(`server started on port ${port}`));
})