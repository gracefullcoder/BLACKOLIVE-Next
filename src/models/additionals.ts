import mongoose from "mongoose";

const additonalsSchema = new mongoose.Schema({
    label: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    }
})

const Additionals = mongoose.models.Additionals || mongoose.model("Additionals", additonalsSchema);

export default Additionals;