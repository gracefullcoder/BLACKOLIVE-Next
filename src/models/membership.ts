import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "MembershipProd"
    },
    startDate: {
        type: Date
    },
    timing: {
        type: Number,
        min: 0,
        max: 24
    },
    bonusUsed: {
        type: Number,
        default: 0
    }
})

const Feedback = mongoose.model("Feedback", membershipSchema);

export default Feedback;