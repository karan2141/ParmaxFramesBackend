import mongoose from "mongoose";
// import autoIncrement from "mongoose-auto-increment"

const ordersSchema = new mongoose.Schema({
    images: { type: [Object], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    price: { type: Number, required: true },
    paymentStatus: { type: Boolean },
    address: { type: Object },
    razorpayOrder: { type: Object },
    phone: String,
    name: String,
    email: String,
    promoCode: String,
    discount: Number,
    pricePerFrame: Number
},
{
    timestamps: true
})

const Order = mongoose.model("Order", ordersSchema)

// autoIncrement.initialize(mongoose.connection);
// ordersSchema.plugin( autoIncrement.plugin, { model: 'Order', field: 'orderId', startAt: 1, incrementBy: 1 })


export default Order