import express from 'express'
import connectMongoDb from './mongoConfig.js'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import cors from 'cors';
import passport from 'passport'
import cookieSession from 'cookie-session'
import PassportSetup from './PassportSetup.js';
import googleRouter from './routes/googleAuth.js'
import emailAuthRouter from './routes/emailAuth.js'

connectMongoDb()

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(
    cookieSession({
        name: 'session',
        keys: ['cyberwolve'],
        maxAge: 24*60*60*100
    })
)

app.use(passport.initialize())

app.use("/auth", googleRouter)
app.use("/auth", emailAuthRouter)

const port = process.env.PORT || 8080
app.listen(port, ()=>{
    console.log(chalk.green(`server started on port ${port}`));
})