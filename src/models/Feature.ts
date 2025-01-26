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
    ]
})

const Feature = mongoose.models.Feature || mongoose.model("Feature", featureSchema);

export default Feature;