import mongoose from "mongoose";

const memProductSchema = new mongoose.Schema({
    title: {
        type: String
    },
    details: {
        type: String
    },
    image: {
        type: String
    },
    speciality: {
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number
    },
    finalPrice: {
        type: Number
    },
    timings: [{
        type: String
    }],
    days: {
        type: Number
    },
    bonus: {
        type: Number
    },
    responses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Feedback"
        }
    ]
})

const MembershipProduct = mongoose.models.MembershipProduct || mongoose.model("MembershipProduct", memProductSchema);

export default MembershipProduct;