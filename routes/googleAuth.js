import { Router } from "express";
import { google, mobilegoogle } from "../controllers/googleAuth.controller.js";

const googleRouter = Router()

googleRouter.post('/google', google)
googleRouter.post('/mobilegoogle', mobilegoogle)

export default googleRouter