import { Router } from "express";
import { google } from "../controllers/googleAuth.controller.js";

const googleRouter = Router()

googleRouter.post('/google', google)

export default googleRouter