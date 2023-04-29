import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment"

const userSchema = new mongoose.Schema({
    email: { type: String, index: true },
    googleData: {},
    facebookData: {},
    OTP: String,
    images: [{
        src: String,
        scale: Number,
        x: Number,
        y: Number,
        frame: String,
        filter: String
    }],
    orders: [mongoose.Schema.Types.ObjectId]
},
{
    timestamps: true
})

const User = mongoose.model("user", userSchema)

const ordersSchema = new mongoose.Schema({
    images: { type: [String], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    price: { type: Number, required: true },
    paymentStatus: { type: Boolean }
},
{
    timestamps: true
})

const Order = mongoose.model("Order", ordersSchema)

autoIncrement.initialize(mongoose.connection);
ordersSchema.plugin( autoIncrement.plugin, { model: 'Order', field: 'orderId', startAt: 1, incrementBy: 1 })

const messageSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    subject: String,
    message: String
})

const Message = mongoose.model("message", messageSchema)

export {
    User,
    Order,
    Message
}