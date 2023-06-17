import Jwt from 'jsonwebtoken'
import { JwtExpireInMin, JwtSecret } from "../constants.js";
import Admin from "../models/adminModel.js";
import { ResposneHandler } from "../utils.js";
import Order from '../models/orderModel.js';

export const login = async( req, res ) => {
    try {
        const { email, password } = req.body
        const user = await Admin.findOne({ email })
        if( user && user.password === password ) {
            const token = Jwt.sign({ userId: user._id }, JwtSecret, {
                expiresIn: Number(JwtExpireInMin*60)
            });
            res.send(ResposneHandler({
                status: 200,
                message: 'Successfully logged in as admin',
                data: {
                    token
                }
            }))
        } else {
            res.send(ResposneHandler({
                status: 401,
                message: 'Unauthorized'
            }))
        }
    } catch (e) {
        res.send(ResposneHandler({
            status: 404,
            message: 'Something went wrong'
        }))
    }
}

export const getOrders = async(req, res) => {
    try {
        const { pageNo, pageSize, status = null } = req.body
        const totalCounts = await Order.find({ paymentStatus: true }).count()
        const skipCount = (pageNo - 1) * pageSize;
        let query = {
            paymentStatus: true
        }
        if(status) query.orderStatus = status
        const orders = await Order.find(query).sort({createdAt: -1}).skip(skipCount).limit(pageSize)
        const orderData = orders.map((order)=>{
            return {
                // images: order.images,
                id: order.id,
                price: order.price,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus || 'pending',
                createdAt: order.createdAt,
                address: Object.keys(order.address).map((k)=> order.address[k]).join(", "),
                orderId: order.razorpayOrder.id,
                contactDetails: [order.name, order.phone, order.email].join(", "),
                // discount: order.discount
            }
        })
        res.send(ResposneHandler({
            status: 200,
            message: 'Success',
            data: {
                orders: orderData,
                totalData: totalCounts
            }
        }))
    } catch (e) {
        res.send(ResposneHandler({
            status: 404,
            message: 'Something went wrong'
        }))
    }
}

export const setOrderStatus = async(req, res) => {
    try {
        const { id, status } = req.body
        const order = await Order.findById(id)
        if( order ) {
            order.orderStatus = status
            order.save()
            res.send(ResposneHandler({
                status: 200,
                message: 'Successfull'
            }))
        } else {
            res.send(ResposneHandler({
                status: 404,
                message: 'Order Not Found'
            }))
        }
    } catch (e) {
        res.send(ResposneHandler({
            status: 404,
            message: 'Something went wrong'
        }))
    }
}