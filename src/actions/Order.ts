"use server"
import Order from "../models/order";
import User from "../models/user";
import { revalidatePath } from "next/cache";

export const createOrder = async (
    userId: string,
    orderItems: Array<{ product: string, quantity: number }>,
    addressId: number,
    contact: number,
    time: number
) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const selectedAddress = user.addresses[addressId];
        if (!selectedAddress) {
            return { success: false, message: "Address not found" };
        }

        const order = await Order.create({
            orders: orderItems,
            address: selectedAddress,
            contact: contact || user.contact,
            time,
            overallRating: 0
        });

        await User.findByIdAndUpdate(userId, {
            $push: { orderDetails: order._id },
            $set: { cart: [] }
        });

        revalidatePath('/cart');
        revalidatePath('/orders');
        return { success: true, message: "Order created successfully", orderId: JSON.parse(JSON.stringify(order._id)) };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, message: "Failed to create order" };
    }
};

export const verifyUserDetails = async (userId: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const hasContact = user.contact !== undefined && user.contact !== null;
        const hasAddress = user.addresses && user.addresses.length > 0;

        return {
            success: true,
            isComplete: hasContact && hasAddress,
            hasContact,
            hasAddress,
            addresses: user.addresses || [],
            contact: user.contact
        };
    } catch (error) {
        console.error("Error verifying user details:", error);
        return { success: false, message: "Failed to verify user details" };
    }
};