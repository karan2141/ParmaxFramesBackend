import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
    email: { type: String, index: true },
    password: { type: String }
},
{
    timestamps: true
})

const Admin = mongoose.model("admin", adminSchema)

export default Admin