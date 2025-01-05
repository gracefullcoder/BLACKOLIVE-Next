import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new mongoose.Schema({
    orders: [
        {
            product: {
                type: Schema.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number
            },
            reponse: {
                type: Schema.ObjectId,
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
    }
}, { timestamps: true })

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;