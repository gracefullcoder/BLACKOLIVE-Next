import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    adminOrder: {
        customerName: {
            type: String
        }
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MembershipProduct"
    },
    products: [
        {
            _id: false,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            price: {
                type: Number
            },
            finalPrice: {
                type: Number
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
    days: {
        type: Number
    },
    discountPercent: {
        type: Number
    },
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
    paymentId: {
        type: String
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
    postponedItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MembershipProduct"
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