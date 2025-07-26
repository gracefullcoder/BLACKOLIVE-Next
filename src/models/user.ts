import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    profileImage: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isDelivery: {
        type: Boolean,
        default: false
    },
    contact: {
        type: Number,
        length: 10
    },
    addresses: [
        {
            number: String,
            address: String,
            landmark: String,
            pincode: {
                type: Number,
                length: 6
            }
        }
    ],
    orderDetails: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    cart: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                min: 1
            },
        }
    ],
    membershipDetails: [
        {
            type: Schema.Types.ObjectId,
            ref: "MembershipOrder"
        }

    ]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
