import { Router } from "express"
import JwtAuthMiddleware from "../middleware/jwtAuth.js"
import Order from "../models/orderModel.js"
import Message from "../models/messageModel.js"
import User from "../models/userModel.js"

const baseRouter = Router()

baseRouter.get('/authenticate', JwtAuthMiddleware, async(req, res)=>{
    const { userId } = req.body
    const user = await User.findById(userId)
    const { images, email, googleData, facebookData } = user
    const profilePic = googleData ? googleData.picture : facebookData ? googleData.picture.data.url : null
    res.send({
        status: 200,
        message: 'Authorized',
        data: {
            images,
            email,
            profilePic
        }
    })
})

baseRouter.post('/save-progress', JwtAuthMiddleware, async(req, res)=>{
    const { userId, images } = req.body
    try {
        const user = await User.findByIdAndUpdate(userId, { images })
        if(!user) throw 'Bad request'
        res.send({
            status: 200,
            message: 'Success'
        })
    } catch(e) {
        console.log('error in save progress --->', JSON.stringify(e))
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
})

baseRouter.post('/save-order', JwtAuthMiddleware, async(req, res)=> {
    const { userId, finalImages, price } = req.body
    try {
        const order = new Order({
            images: finalImages,
            userId,
            price,
            paymentStatus: false
        })
        await order.save()
        await User.findByIdAndUpdate(userId, { $push: { orders: order._id} })
        res.send({
            status: 200,
            message: 'Order saved Successfully'
        })
    } catch(e) {
        console.log('error in save order --->', JSON.stringify(e))
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
})

baseRouter.post('/contact-us', async(req, res)=> {
    try {
        const { fullName, email, subject, message } = req.body
        const newMessage = new Message({
            fullName,
            email,
            subject,
            message
        })
        await newMessage.save()
        res.send({
            status: 200,
            message: 'Message saved Successfully'
        })
    } catch (e) {
        console.log('error in contact us form --->', JSON.stringify(e))
        res.status(401).json({
            error: new Error('Something went wrong')
        });
    }
})

baseRouter.get('/get-orders', JwtAuthMiddleware, async(req, res)=> {
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
                contactDetails: [order.name, order.phone, order.email].join(", ")
            }
        })
        res.send({
            status: 200,
            message: 'Success',
            data
        })
    } catch (e) {
        console.log('error in get-orders --->', JSON.stringify(e))
        res.status(401).json({
            error: new Error('Something went wrong')
        });
    }
})

export default baseRouter