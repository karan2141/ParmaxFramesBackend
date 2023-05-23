import { instance } from "../index.js"
import crypto from "crypto";
import Payment from "../models/paymentModel.js";
import { FE_URL, RAZORPAY_KEY_SECRET } from "../constants.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import { sendOrderMail, sendOrderMailToOwner } from "../emailService.js";
import PromoCode from "../models/promoCodeModel.js";
import { ResposneHandler } from "../utils.js"

export const checkout = async (req, res) => {
  try {
    const { email, phone, name, amount, images, address, promoCode, pricePerFrame } = req.body
    let actualDiscount
    try {
      const result = await PromoCode.findOne({ code: promoCode })
      actualDiscount = result.discount
    } catch {
      actualDiscount = 0
    }
    const options = {
      amount: Number(amount * 100)-actualDiscount*100,
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    let user = await User.findOne({email})

    if(!user) user = await User.create({
      email,
    })

    const newOrder = await Order.create({
      images,
      userId: user._id,
      price: Number(amount)-Number(actualDiscount),
      paymentStatus: false,
      address,
      razorpayOrder: order,
      phone,
      name,
      email,
      promoCode,
      discount: actualDiscount,
      pricePerFrame
    })

    await User.findOneAndUpdate({email}, { $push: { orders: newOrder._id }} )
  
    res.status(200).json(ResposneHandler({
      success: true,
      order,
    }));
  } catch (e) {
    console.log('checkout error --->', JSON.stringify(e))
    res.status(404).json({
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

      const order = await Order.findOneAndUpdate({'razorpayOrder.id': razorpay_order_id}, {paymentStatus: true})
      const user = await User.findByIdAndUpdate(order.userId, {images: []})

      const orderParams = {
        to: user.email,
        orderId: razorpay_order_id,
        name: order.name,
        address: [order.address.location, order.address.city, order.address.state, order.address.postalCode].join(', '),
        country: order.country,
        pricePerFrame: order.pricePerFrame,
        noOfFrames: order.images.length,
        discount: order.discount,
        price: order.price
      }
      sendOrderMail(orderParams)

      const attachments = order.images.map((img, i) => {
        const extension = img.image.split(';')[0].split('/')[1] || 'jpg'
        return {
          filename: `image-${i+1}-frame-${img.frame}.${extension}`,
          content: img.image.replace('data:', '').replace(/^.+,/, ''),
          encoding: 'base64'
        }
      })

      const orderDetails = {
        orderId: razorpay_order_id,
        attachments,
        email: order.email,
        phone: order.phone,
        name: order.name,
        address: Object.keys(order.address).map((k)=> order.address[k]).join(", ")
      }

      sendOrderMailToOwner(orderDetails)

      res.redirect(
        `${FE_URL}/paymentstatus?id=${razorpay_order_id}`
      );
    } else {
      res.status(400).json({
        success: false,
      });
    } 
  } catch (e) {
    console.log('payment verification error --->', JSON.stringify(e))
    res.status(404).json({
        error: new Error('Invalid request!')
    });
  }
};

export const getOrderDetails = async(req, res) => {
  try {
    const { id } = req.body
    const order = await Order.findOne({'razorpayOrder.id': id})
    if( !order || !order.paymentStatus) throw 'payment failed or dont exist'

    const orderParams = {
      name: order.name,
      address: [order.address.location, order.address.city, order.address.state, order.address.postalCode].join(', '),
      country: order.country,
      pricePerFrame: order.pricePerFrame,
      noOfFrames: order.images.length,
      discount: order.discount,
      price: order.price
    }
    res.status(200).json(ResposneHandler(orderParams));
  } catch (e) {
    console.log('get order details error --->', JSON.stringify(e))
    res.status(404).json({
        error: new Error('Invalid request!')
    });
  }
}