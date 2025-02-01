"use server"
import connectToDatabase from "../lib/ConnectDb"
import User from "../models/user"

export const getUserByMail = async (email: string) => {
    try {
        await connectToDatabase()
        const userData = await User.findOne({ email: email })

        console.log(userData)
        if (!userData) {
            return { success: true, user: false }
        }

        return { success: true, user: JSON.parse(JSON.stringify(userData)) };
    } catch (error: any) {
        console.log(error);
        return { success: false, message: error.message || "Failed to get User Details" }
    }
}

export const getUserByContact = async (contact: number | string) => {
    try {
        await connectToDatabase()
        const userData = await User.findOne({ contact })

        console.log(userData)
        if (!userData) {
            return { success: true, user: false }
        }

        return { success: true, user: JSON.parse(JSON.stringify(userData)) };
    } catch (error: any) {
        console.log(error);
        return { success: false, message: error.message || "Failed to get User Details" }
    }
}

export const addUserDetails = async (email: string, formData: FormData) => {
    const contact = formData.get("contact");
    const number = formData.get("number");
    const address = formData.get("address");
    const pincode = formData.get("pincode");
    const landmark = formData.get("landmark");
    const newAddress = { number, address, pincode, landmark }

    const userData = await User.findOneAndUpdate({ email }, { contact: contact, $push: { addresses: { newAddress } } }, { new: true });
    if (userData.contact) {
        return { success: true, message: "Info Added SuccessFully" }
    }

    console.log(formData.get("contact"))

    return { success: true, message: "Not able to update user data" }
}

export const deliveryUsers = async () => {
    const users = await User.find({
        $or: [{ isAdmin: true }, { isDelivery: true }]
    }).select('name email contact');
    return { success: true, users: JSON.parse(JSON.stringify(users)) };
}

