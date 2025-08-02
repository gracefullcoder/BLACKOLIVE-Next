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
    timings: [{
        type: String
    }],
    days: {
        type: Number
    },
    bonus: {
        type: Number
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    additionalProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    discountPercent: {
        type: Number,
        default: 0
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