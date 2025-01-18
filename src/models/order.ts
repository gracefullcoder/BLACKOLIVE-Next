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
    overallRating: {
        type: Number,
        min: 0,
        max: 5
    },
    status: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;