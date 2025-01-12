"use server"
import axios from "axios";
import connectToDatabase from "../lib/ConnectDb";
import MembershipOrder from "../models/membershipOrder";
import Order from "../models/order";
import User from "../models/user";
import { revalidatePath } from "next/cache";
import MembershipProduct from "../models/membershipproducts";

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

        const memebershipDetails = await MembershipProduct.findById(orderItem);

        const graphLength = memebershipDetails.days + memebershipDetails.bonus
        const deliveryGraph = new Array(graphLength).fill(1);

        for (let i = memebershipDetails.days; i < graphLength; i++) deliveryGraph[i] = 0

        const order = await MembershipOrder.create({
            category: orderItem,
            address: selectedAddress,
            contact: contact || user.contact,
            time,
            overallRating: 0,
            startDate,
            deliveryGraph
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

export async function useBonus(idx: number, orderId: String) {
    const membershipDetails = await MembershipOrder.findById(orderId).populate("category");

    if (membershipDetails.bonusUsed < membershipDetails.category.bonus) {
        let updatedIdx = -1;
        for (let i = idx + 1; i <= membershipDetails.deliveryGraph.length; i++) {
            if (membershipDetails.deliveryGraph[i] == 0) {
                membershipDetails.deliveryGraph[i] = 1;
                membershipDetails.deliveryGraph[idx] = 0;
                membershipDetails.bonusUsed++;
                updatedIdx = i;
                break;
            }
        }

        await membershipDetails.save()

        return { success: true, message: "Bonus Used!", updatedIdx }
    }
    return { success: false, message: "All Bonus Used!" }

}