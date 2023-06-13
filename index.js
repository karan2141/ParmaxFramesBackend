import express from 'express'
import connectMongoDb from './mongoConfig.js'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import cors from 'cors';
import googleRouter from './routes/googleAuth.js'
import emailAuthRouter from './routes/emailAuth.js'
import facebookRouter from './routes/facebookAuth.js';
import baseRouter from './routes/baseRoutes.js';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from './constants.js';
import paymentRouter from './routes/paymentRoute.js';
import Razorpay from 'razorpay'
import DecryptRequest from './middleware/decryptReq.js';
import adminRouter from './routes/adminRoute.js';

connectMongoDb()

const app = express()

app.use(cors({
    origin: '*',
    methods: "GET,POST,OPTIONS"
}))

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));

app.use(bodyParser.json({limit: '50mb'}));

app.use(express.json());

export const instance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});

app.use("/payment", DecryptRequest, paymentRouter);
app.use("/auth", DecryptRequest, googleRouter)
app.use("/auth", DecryptRequest, facebookRouter)
app.use("/auth", DecryptRequest, emailAuthRouter)
app.use("/admin", DecryptRequest, adminRouter)
app.use("", DecryptRequest, baseRouter)

const port = process.env.PORT || 8080
app.listen(port, ()=>{
    console.log(chalk.green(`server started on port ${port}`));
})