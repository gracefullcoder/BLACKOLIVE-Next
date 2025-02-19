import mongoose from "mongoose";

const { Schema } = mongoose;

const contactSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    contact: {
        type: Number
    },
    message: {
        type: String
    }
})

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;