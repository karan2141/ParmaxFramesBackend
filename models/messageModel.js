import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    subject: String,
    message: String
},
{
    timestamps: true
})

const Message = mongoose.model("message", messageSchema)

export default Message