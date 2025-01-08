"use server"
import axios from "axios";
import connectToDatabase from "../lib/ConnectDb";
import MembershipOrder from "../models/membershipOrder";
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


export const createMembership = async (
    userId: string,
    orderItem: string,
    addressId: number,
    contact: number,
    time: number,
    startDate: Date
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

        const order = await MembershipOrder.create({
            category: orderItem,
            address: selectedAddress,
            contact: contact || user.contact,
            time,
            overallRating: 0,
            startDate
        });

        await User.findByIdAndUpdate(userId, {
            $push: { membershipDetails: order._id },
            $set: { cart: [] }
        });

        return { success: true, message: "Membership created successfully", orderId: JSON.parse(JSON.stringify(order._id)) };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, message: "Failed to create order" };
    }
};

export const getOrders = async (userId: string) => {
    try {
        await connectToDatabase()

        const orderDetails = await User.findById(userId)
            .select("orderDetails membershipDetails")
            .populate([
                {
                    path: "orderDetails",
                    populate: {
                        path: "orders.product",
                        model: "Product"
                    }
                },
                {
                    path: "membershipDetails",
                    populate: {
                        path: "category",
                        model: "MembershipProduct"
                    }
                }
            ]);

        return { success: true, data: JSON.parse(JSON.stringify(orderDetails)) };
    } catch (error) {
        console.log(error)
        return { success: false, message: "Error in fetching products" };
    }
}

export async function getMembershipOrder(id: string, userId: string) {
    try {
        const details = await User.findById(userId).select("membershipDetails");

        if (details.membershipDetails.includes(id)) {
            const data = await MembershipOrder.findById(id).populate('category');
            console.log(data)
            return JSON.parse(JSON.stringify(data));
        }

        return { success: false, message: "Not able to find order" };

    } catch (error) {
        console.error('Failed to fetch membership order:', error);
        return null;
    }
}