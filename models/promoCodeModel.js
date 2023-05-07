import mongoose from "mongoose"

const promoCodeSchema = new mongoose.Schema({
    code: String,
    active: Boolean,
    discount: Number,
},
{
    timestamps: true
})

const PromoCode = new mongoose.model("promoCode", promoCodeSchema)

export default PromoCode