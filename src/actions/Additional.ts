"use server"

import Contact from "../models/contact"

export interface contactInterface {
    user:null | string,
    name: string,
    email: string,
    contact: string,
    message: string
}

export const handleContactRequest = async (details: contactInterface) => {
    try {
        const contactDetails = new Contact(details);
    await contactDetails.save();

    return { success: true, message: "Request Added SuccessFully!" }
    } catch (error:any) {
        console.log(error);
            return { success: false, message: error?.message || "Internal Server error!" };
    }
}