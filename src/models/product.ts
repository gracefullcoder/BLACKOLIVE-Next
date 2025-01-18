import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String
    },
    details: {
        type: String
    },
    image: {
        type: String
    },
    fileId: {
        type: String
    },
    speciality: {
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number
    },
    finalPrice: {
        type: Number
    },
    responses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Feedback"
        }
    ]
})

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;