import { Router } from "express";
import { checkout, getOrderDetails, paymentVerification } from "../controllers/payment.controller.js";

const paymentRouter = Router()

paymentRouter.route("/checkout").post(checkout);

paymentRouter.route("/verification").post(paymentVerification);

paymentRouter.route("/getOrderDetails").post(getOrderDetails)

export default paymentRouter