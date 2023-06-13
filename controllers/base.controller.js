import Message from "../models/messageModel.js"
import Order from "../models/orderModel.js"
import PromoCode from "../models/promoCodeModel.js"
import User from "../models/userModel.js"
import { ResposneHandler } from "../utils.js"

export const authenticate = async(req, res)=>{
    const { userId } = req.body
    const user = await User.findById(userId)
    const { images, email, googleData, facebookData, loggedInBy='email' } = user
    const profilePic = loggedInBy === 'google' ? googleData?.picture : loggedInBy === 'facebook' ? googleData?.picture?.data?.url : null
    res.send(ResposneHandler({
        status: 200,
        message: 'Authorized',
        data: {
            images,
            email,
            profilePic
        }
    }))
}

export const saveProgress = async(req, res)=>{
    const { userId, images } = req.body
    try {
        const user = await User.findByIdAndUpdate(userId, { images })
        if(!user) throw 'Bad request'
        res.send(ResposneHandler({
            status: 200,
            message: 'Success'
        }))
    } catch(e) {
        console.log('error in save progress --->', JSON.stringify(e))
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
}

export const saveOrder = async(req, res)=> {
    const { userId, finalImages, price } = req.body
    try {
        const order = new Order({
            images: finalImages,
            userId,
            price,
            paymentStatus: false,
            orderStatus: 'pending'
        })
        await order.save()
        await User.findByIdAndUpdate(userId, { $push: { orders: order._id} })
        res.send(ResposneHandler({
            status: 200,
            message: 'Order saved Successfully'
        }))
    } catch(e) {
        console.log('error in save order --->', JSON.stringify(e))
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
}

export const contactUs = async(req, res)=> {
    try {
        const { fullName, email, subject, message } = req.body
        const newMessage = new Message({
            fullName,
            email,
            subject,
            message
        })
        await newMessage.save()
        res.send(ResposneHandler({
            status: 200,
            message: 'Message saved Successfully'
        }))
    } catch (e) {
        console.log('error in contact us form --->', JSON.stringify(e))
        res.status(401).json({
            error: new Error('Something went wrong')
        });
    }
}

export const getOrders = async(req, res)=> {
    try {
        const { userId } = req.body
        const orders = await Order.find({ userId })
        const data = orders.map((order)=>{
            return {
                images: order.images.length,
                price: order.price,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt,
                address: Object.keys(order.address).map((k)=> order.address[k]).join(", "),
                orderId: order.razorpayOrder.id,
                contactDetails: [order.name, order.phone, order.email].join(", "),
                discount: order.discount
            }
        })
        res.send(ResposneHandler({
            status: 200,
            message: 'Success',
            data
        }))
    } catch (e) {
        console.log('error in get-orders --->', JSON.stringify(e))
        res.status(401).json({
            error: new Error('Something went wrong')
        });
    }
}

export const checkPromoCode = async(req, res) => {
    try {
        const { code } = req.body
        const existing = await PromoCode.findOne({ code })
        if (!existing || !existing.active) {
            res.send(ResposneHandler({
                status: 404,
                message: 'Invalid PromoCode'
            }))
        } else {
            res.send(ResposneHandler({
                status: 200,
                message: 'Promocode successfully applied',
                data: {
                    code: existing.code,
                    discount: existing.discount
                }
            }))
        }
    } catch (e) {
        console.log('error in check-promocode --->', JSON.stringify(e))
        res.status(500).json({
            error: new Error('Something went wrong')
        });
    }
}