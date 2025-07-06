import mongoose from "mongoose";
const { Schema } = mongoose;

const featureSchema = new Schema({
    heroImage: {
        type: String
    },
    fileId: {
        type: String
    },
    shopStatus: {
        type: String
    },
    deliveryTimings: [
        {
            startTime: {
                type: String
            },
            endTime: {
                type: String
            },
            deliveryTime: {
                type: String
            },
            display: {
                type: String
            }
        }
    ],
    topBarMessages: [String],
    pincodes: [{
        _id: false,
        pincode: {
            type: Number
        },
        deliveryCharge: {
            type: Number
        }
    }]
})

const Feature = mongoose.models.Feature || mongoose.model("Feature", featureSchema);

export default Feature;