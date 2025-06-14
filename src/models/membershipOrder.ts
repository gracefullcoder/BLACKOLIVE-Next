import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MembershipProduct"
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            customizations: [
                {
                    label: {
                        type: String
                    },
                    priceDiscounted: {
                        type: Number
                    }
                }
            ],
            additonals: [
                {
                    addType: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Additonals"
                    },
                    priceCharged: {
                        type: Number
                    }
                }
            ]
        }
    ],
    startDate: {
        type: Date
    },
    time: {
        type: String
    },
    address: {
        number: String,
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
    message: {
        type: String
    },
    extraCharge: {
        type: Number
    },
    isPaid: {
        type: Boolean
    },
    status: {
        type: String,
        default: "pending"
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    deliveryGraph: [{
        type: Number
    }],
    deliveryDates: [
        {
            type: Date
        }
    ],
    postponedDates: [
        {
            type: Date
        }
    ],
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