import { Router } from "express";
import { checkout, paymentVerification } from "../controllers/payment.controller.js";

const paymentRouter = Router()

paymentRouter.route("/checkout").post(checkout);

paymentRouter.route("/verification").post(paymentVerification);

export default paymentRouter