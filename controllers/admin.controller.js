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
        const orders = await Order.find({ paymentStatus: true }).sort({createdAt: -1})
        const data = orders.map((order)=>{
            return {
                images: order.images,
                price: order.price,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus,
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
        res.send(ResposneHandler({
            status: 404,
            message: 'Something went wrong'
        }))
    }
}