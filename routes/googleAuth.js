import { Router } from "express";
import passport from 'passport'
import { FE_URL } from "../constants.js"

const googleRouter = Router()

googleRouter.get(
    '/login/success',
    (req,res)=>{
        if(req.isAuthenticated()) {
            res.status(200).json({
                error: false,
                message: 'Successfully Loged in',
                user: req.user
            })
        } else {
            res.status(403).json({
                error: true,
                message: 'UnAuthorized'
            })
        }
    }
)

googleRouter.get(
    '/login/failed',
    (req,res)=>{
        res.status(401).json({
            error: true,
            message: 'Log in failure'
        })
    }
)

googleRouter.get(
    '/google/callback',
    passport.authenticate("google", {
        successRedirect: FE_URL,
        failureRedirect: "/login/failed"
    })
)

googleRouter.get(
    '/google',
    passport.authenticate("google",["profile", "email"])
)

googleRouter.get(
    '/logout',
    (req,res)=>{
        req.logOut(),
        res.redirect(FE_URL)
    }
)

export default googleRouter