import mongoose from "mongoose";

const { Schema } = mongoose;

const contactSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    contact: {
        type: String
    },
    message: {
        type: String
    }
})

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;