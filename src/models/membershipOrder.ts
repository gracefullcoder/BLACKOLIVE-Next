import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "MembershipProduct"
    },
    startDate: {
        type: Date
    },
    time: {
        type: Number,
        min: 0,
        max: 24
    },
    address: {
        number: Number,
        address: String,
        landmark: String,
        pincode: {
            type: Number,
            length: 6
        }
    },
    contact: {
        type: Number,
        length: 10
    },
    bonusUsed: {
        type: Number,
        default: 0
    },
    overallRating: {
        type: Number,
        min: 0,
        max: 5
    }
})

const MembershipOrder = mongoose.models.MembershipOrder || mongoose.model("MembershipOrder", membershipSchema);

export default MembershipOrder;