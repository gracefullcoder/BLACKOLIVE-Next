import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new mongoose.Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    adminOrder: {
        customerName: {
            type: String
        }
    },
    orders: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            priceCharged: {
                type: Number
            },
            quantity: {
                type: Number
            },
            response: {
                type: Schema.Types.ObjectId,
                ref: "Feedback"
            },
            extraCharge: {
                type: Number
            }
        }
    ],
    address: {
        number: String,
        address: String,
        landmark: String,
        pincode: {
            type: Number,
            length: 6
        }
    },
    isPaid: {
        type: Boolean
    },
    paymentId: {
        type: String
    },
    contact: {
        type: Number,
        length: 10
    },
    time: {
        type: String
    },
    overallRating: {
        type: Number,
        min: 0,
        max: 5
    },
    status: {
        type: String,
        default: "pending"
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    deliveryDate: {
        type: Date
    },
    deliveryCharge: {
        type: Number
    },
    message: {
        type: String
    }
}, { timestamps: true })

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;