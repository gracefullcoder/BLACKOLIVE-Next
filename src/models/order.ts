import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new mongoose.Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    orders: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number
            },
            reponse: {
                type: Schema.Types.ObjectId,
                ref: "Feedback"
            }
        }
    ],
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
    time: {
        type: Number,
        min: 0,
        max: 24
    },
    instant: {
        type: Boolean,
        default: false
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
    message: {
        type: String
    }
}, { timestamps: true })

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;