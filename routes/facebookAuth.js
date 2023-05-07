import { Router } from "express";
import { facebook } from "../controllers/facebookAuth.controller.js";

const facebookRouter = Router()

facebookRouter.post('/facebook', facebook)

export default facebookRouter