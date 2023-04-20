import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: { type: String, index: true},
    OTP: String,
},
{
    timestamps: true
}
)

const User = mongoose.model("user", userSchema)

export {
    User
}