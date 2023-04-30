import { instance } from "../index.js"
import crypto from "crypto";
import Payment from "../models/paymentModel.js";
import { FE_URL, RAZORPAY_KEY_SECRET } from "../constants.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";


export const checkout = async (req, res) => {
  try {
    const { email='kvs2141@gmail.com', phone='9855309403', name='Karanveer Singh', amount, images, address } = req.body
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    let user = await User.findOne({email})

    if(!user) user = await User.create({
      email,
    })

    const newOrder = new Order({
      images,
      userId: user._id,
      price: amount,
      paymentStatus: false,
      address,
      razorpayOrder: order
    })

    await newOrder.save()

    await User.findOneAndUpdate({email}, { $push: { orders: newOrder._id }} )
  
    res.status(200).json({
      success: true,
      order,
    });
  } catch (e) {
    console.log('checkout error --->', JSON.stringify(e))
    res.status(401).json({
        error: new Error('Invalid request!')
    });
  }
};

export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {

      const newPayment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      })

      await newPayment.save()

      res.redirect(
        `${FE_URL}/paymentsuccess?reference=${razorpay_payment_id}`
      );
    } else {
      res.status(400).json({
        success: false,
      });
    } 
  } catch (e) {
    console.log('payment verification error --->', JSON.stringify(e))
    res.status(401).json({
        error: new Error('Invalid request!')
    });
  }
};