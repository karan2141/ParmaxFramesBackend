import mongoose from "mongoose"

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

export default User