import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: String,
    email: { type: String, index: true},
},
{
    timestamps: true
}
)

const User = mongoose.model("user", userSchema)

export {
    User
}