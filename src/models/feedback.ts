import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    feedback: {
        type: String
    }
})

const Feedback = mongoose.model("Feedback",feedbackSchema);

export default Feedback;