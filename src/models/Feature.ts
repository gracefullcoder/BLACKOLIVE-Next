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
    }
})

const Feature = mongoose.models.Feature || mongoose.model("Feature", featureSchema);

export default Feature;