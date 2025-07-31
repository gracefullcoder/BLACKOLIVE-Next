"use server"
import connectToDatabase from "../lib/ConnectDb";
import MembershipOrder from "../models/membershipOrder";
import Order from "../models/order";
import User from "../models/user";
import MembershipProduct from "../models/membershipproducts";
import Product from "../models/product";
import { getServerSession } from "next-auth";
import AuthConfig from "../lib/auth";
import { membershipEmailTemplate, orderEmailTemplate, resendMail, sendMail } from "../utility/mail";
import { toast } from "react-toastify";
import Additionals from "../models/additionals";
import { getTodayItem } from "../utility/MembershipUtils/MembershipUtility";
import { validateSignature } from "./Payment";
import { MembershipCreationType, OrderCreationType } from "../types/orderType";



export const createOrder = async (
    {
        userId,
        orderItems,
        addressId,
        contact,
        time,
        message,
        isPaid,
        totalAmount,
        deliveryCharge,
        paymentId,
        adminOrder
    }: OrderCreationType,
    paymentData?: any
) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return { success: false, message: "User not found" };
        }

        if (paymentData) {
            let isValid = await validateSignature(paymentData);
            if (!isValid) return { success: false, message: "Created Mismatch in request you will be blocked!" };
            console.log("razorpay verified paymnet ", isValid);
        }

        // const productIds = orderItems.map((item: any) => item.product);
        // const products = await Product.find({ _id: { $in: productIds } });

        // console.log(products)

        // const unavailableProducts: string[] = [];
        // const orderedProducts: any = [];

        // products.forEach((product, idx) => {
        //     if (!product.isAvailable) {
        //         unavailableProducts.push(product.title)
        //     }
        //     orderedProducts.push({ product: product.title, price: product.finalPrice, quantity: orderItems[idx].quantity });
        // })

        // if (unavailableProducts.length != 0) {
        //     return {
        //         success: false,
        //         message: `${unavailableProducts.toString()}`.concat(" Unavailable")
        //     };
        // }

        const selectedAddress = user.addresses[addressId];
        if (!selectedAddress) {
            return { success: false, message: "Address not found" };
        }

        const order = await Order.create({
            user: userId,
            orders: orderItems,
            address: selectedAddress,
            contact: contact || user.contact,
            time,
            overallRating: 0,
            message,
            isPaid: typeof (isPaid) == "boolean" ? isPaid : false,
            paymentId,
            deliveryCharge,
            adminOrder
        });

        await User.findByIdAndUpdate(userId, {
            $push: { orderDetails: order._id },
            $set: { cart: [] }
        });

        const orderDetails = { userName: user.name, orderId: order._id, address: selectedAddress, contact, time, orderItems, totalAmount };
        const mailRes = await resendMail({ email: user.email, subject: "Order Confirmation", html: orderEmailTemplate(orderDetails) });

        return { success: true, mailRes, message: "Order created successfully", orderId: JSON.parse(JSON.stringify(order._id)) };
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


export const createMembership = async (membershipData: MembershipCreationType, mailData?: any, paymentData?: any,) => {
    try {

        if (paymentData) {
            let isValid = await validateSignature(paymentData);
            if (!isValid) return { success: false, message: "Created Mismatch in request you will be blocked!" };
            console.log("razorpay verified paymnet ", isValid);
        }

        const user = await User.findById(membershipData.user);
        if (!user) {
            return { success: false, message: "User not found" };
        }

        // Validate address structure
        if (!membershipData.address || !membershipData.address.number || !membershipData.address.address || !membershipData.address.pincode) {
            return { success: false, message: "Invalid address structure" };
        }

        // const memebershipDetails = await MembershipProduct.findById(membershipData.category);

        // const graphLength = memebershipDetails.days + memebershipDetails.bonus
        // const deliveryGraph = new Array(graphLength).fill(1);

        // for (let i = memebershipDetails.days; i < graphLength; i++) deliveryGraph[i] = 0

        const order = await MembershipOrder.create(membershipData);

        await User.findByIdAndUpdate(membershipData.user, {
            $push: { membershipDetails: order._id }
        });

        const orderDetails = {
            userName: user.name,
            orderId: order._id,
            address: membershipData.address,
            contact: membershipData.contact,
            time: membershipData.time,
            orderItems: [{
                product: mailData.title,
                price: mailData.finalPrice,
                days: membershipData.days
            }],
            totalPrice: mailData.finalPrice
        };
        const mailRes = await resendMail({ email: user.email, subject: "Membership Confirmation", html: membershipEmailTemplate(orderDetails) });

        return { success: true, message: "Membership created successfully", mailRes, orderId: JSON.parse(JSON.stringify(order._id)) };
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
                        model: Product
                    }
                },
                {
                    path: "membershipDetails",
                    populate: {
                        path: "category",
                        model: MembershipProduct
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
            const data = await MembershipOrder.findById(id)
                .populate({ path: 'category', model: MembershipProduct });
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
    const membershipDetails = await MembershipOrder.findById(orderId).populate({ path: 'category', model: MembershipProduct });

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

export const postponeMembership = async (mId: string) => {
    const membership = await MembershipOrder.findById(mId);

    if (!membership) return { success: false, message: "Membership doesn't exist" }


    if (membership.status != "delivered") {
        const utcDate = new Date();
        utcDate.setDate(utcDate.getDate() + 1)
        utcDate.setUTCHours(0, 0, 0, 0);

        if (membership?.postponedDates?.some((date: any) => (date.toString() == utcDate.toString()))) {
            return { success: false, message: "Already Added for postpone" }
        } else {
            console.log("Herer to update psotoen dat", membership.postponedDates, utcDate)
            await MembershipOrder.findByIdAndUpdate(mId, { $push: { postponedDates: utcDate } })
            return { success: true, message: `Order Postponed for Date ${utcDate.getDate()}` }
        }

    } else {
        return { success: false, message: "Membership Is Completed" }
    }
}

export const postponeMembershipByDate = async (mId: string, date: any) => {
    const membership = await MembershipOrder.findById(mId);

    if (!membership) return { success: false, message: "Membership doesn't exist" }


    if (membership.status != "delivered") {
        // const currDate = new Date();
        // currDate.setMinutes(currDate.getMinutes() - currDate.getTimezoneOffset());
        // currDate.setUTCHours(0, 0, 0, 0);

        const postponeDate = new Date(date);

        if (membership?.postponedDates?.some((date: any) => (date.toString() == postponeDate.toString()))) {
            return { success: false, message: "Already Added for postpone" }
        } else {
            const { currentProduct, isItemPostponed } = getTodayItem(membership, false);

            if (isItemPostponed)
                await MembershipOrder.findByIdAndUpdate(mId, { $push: { postponedDates: postponeDate } })
            else
                await MembershipOrder.findByIdAndUpdate(mId, { $push: { postponedDates: postponeDate, postponedItems: currentProduct?._id } })

            return { success: true, message: `Order Postponed for Date ${postponeDate.getDate()}` }
        }

    } else {
        return { success: false, message: "Membership Is Completed" }
    }
}

export const deliverPastMembership = async (mId: string, date: any) => {
    const membership = await MembershipOrder.findById(mId);

    if (!membership) return { success: false, message: "Membership doesn't exist" }


    if (membership.status != "delivered") {
        
        const deliveryDate = new Date(date);

        if (membership?.deliverydDates?.some((date: any) => (date.toString() == deliveryDate.toString()))) {
            return { success: false, message: "Already Added for delivery" }
        } else {
            await MembershipOrder.findByIdAndUpdate(mId, { $push: { deliveryDates: deliveryDate } })
            return { success: true, message: `Marked Order delivered for Date ${deliveryDate.getDate()}` }
        }
    } else {
        return { success: false, message: "Membership Is Completed" }
    }
}

// Get all orders
export async function getAllOrders() {
    try {
        await connectToDatabase();
        const orders = await Order.find()
            .populate([{ path: 'orders.product', model: Product }, { path: "assignedTo", model: User, select: "name" }]).populate({ path: 'user', model: User, select: "name email contact" })
            .sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(orders));
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}

// Update order status
export async function updateOrderStatus(orderId: any, newStatus: any, assignReq?: boolean, assignUser?: string) {
    try {
        await connectToDatabase();
        const { user } = await getServerSession(AuthConfig);

        if (user && user.isDelivery) {
            if (newStatus == "assign" && user.isAdmin) {
                const updatedOrder = await Order.findByIdAndUpdate(
                    orderId,
                    { status: "assigned", assignedTo: assignReq ? assignUser : user._id },
                    { new: true }
                )
                    .populate({ path: "assignedTo", model: User, select: "name" });
                return { success: true, message: "Assigned", product: JSON.parse(JSON.stringify(updatedOrder)) }
            }
            else if (newStatus == "unassign") {
                const updatedOrder = await Order.findByIdAndUpdate(
                    orderId,
                    { status: "pending", assignedTo: null },
                    { new: true }
                )
                    .populate({ path: 'orders.product', model: Product })
                    .populate({ path: "assignedTo", model: User, select: "name" });
                return { success: true, message: "Updated", product: JSON.parse(JSON.stringify(updatedOrder)) }
            }
            else if (newStatus == "delivered") {
                const updatedOrder = await Order.findByIdAndUpdate(
                    orderId,
                    { status: "delivered" },
                    { new: true }
                )
                    .populate({ path: "assignedTo", model: User, select: "name" });

                return { success: true, message: "Marked as Delivered", product: JSON.parse(JSON.stringify(updatedOrder)) }
            }
            else if (newStatus == "cancelled") {
                const updatedOrder = await Order.findByIdAndUpdate(
                    orderId,
                    { status: "cancelled" },
                    { new: true }
                )
                    .populate({ path: "assignedTo", model: User, select: "name" });
                return { success: true, message: "Marked as Cancelled", product: JSON.parse(JSON.stringify(updatedOrder)) }
            }
        } else {
            return { success: false, message: "You are Not authorized" }
        }

    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
}

export async function updateMembershipStatus(orderId: any, newStatus: any, assignReq?: boolean, assignUser?: string) {
    try {
        await connectToDatabase();
        const { user } = await getServerSession(AuthConfig);

        if (user && user.isDelivery) {
            if (newStatus == "assign" && user.isAdmin) {
                const updatedOrder = await MembershipOrder.findByIdAndUpdate(
                    orderId,
                    { status: "assigned", assignedTo: assignReq ? assignUser : user._id },
                    { new: true }
                ).populate({ path: "assignedTo", model: User, select: "name" });
                return { success: true, message: "Assigned", product: JSON.parse(JSON.stringify(updatedOrder)) }
            }
            else if (newStatus == "unassign") {
                const updatedOrder = await MembershipOrder.findByIdAndUpdate(
                    orderId,
                    { status: "pending", assignedTo: null },
                    { new: true }
                ).populate({ path: "assignedTo", model: User, select: "name" });
                return { success: true, message: "Updated", product: JSON.parse(JSON.stringify(updatedOrder)) }
            }
            else if (newStatus == "delivered") {
                const utcDate = new Date();
                utcDate.setUTCHours(0, 0, 0, 0);
                const membershipDetails = await MembershipOrder.findById(orderId).populate({ path: "assignedTo", model: User, select: "name" });

                let { isItemPostponed } = getTodayItem(membershipDetails, false);

                if (isItemPostponed) {
                    membershipDetails?.postponedItems?.splice(0, 1);
                }

                if (membershipDetails.deliveryDates.length === membershipDetails.days - 1) {
                    membershipDetails.status = "delivered";
                }

                membershipDetails.deliveryDates.push(utcDate)

                await membershipDetails.save();

                return { success: true, message: "Marked as Delivered", product: JSON.parse(JSON.stringify(membershipDetails)) }
            }
            else if (newStatus == "cancelled") {
                const updatedOrder = await MembershipOrder.findByIdAndUpdate(
                    orderId,
                    { status: "cancelled" },
                    { new: true }
                ).populate({ path: "assignedTo", model: User, select: "name" });
                return { success: true, message: "Marked as Cancelled", product: JSON.parse(JSON.stringify(updatedOrder)) }
            }
        } else {
            return { success: false, message: "You are Not authorized" }
        }

    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
}

// Update product quantity in order
export async function updateOrderQuantity(orderId: any, productId: any, newQuantity: any) {
    try {
        await connectToDatabase();
        const order = await Order.findById(orderId);
        const orderItem = order.orders.find(
            (item: any) => item._id.toString() === productId
        );

        if (!orderItem) {
            throw new Error('Product not found in order');
        }

        orderItem.quantity = newQuantity;
        await order.save();

        const updatedOrder = await order.populate({ path: 'orders.product', model: Product });
        return JSON.parse(JSON.stringify(updatedOrder));
    } catch (error) {
        console.error("Error updating quantity:", error);
        throw error;
    }
}

// Remove product from order
export async function removeProductFromOrder(orderId: any, productId: any) {
    try {
        const order = await Order.findById(orderId);

        order.orders = order.orders.filter(
            (item: any) => item._id.toString() !== productId
        );

        await order.save();
        const updatedOrder = await order.populate({ path: 'orders.product', model: Product });
        return JSON.parse(JSON.stringify(updatedOrder));
    } catch (error) {
        console.error("Error removing product:", error);
        throw error;
    }
}

export async function addExtraCharge(orderId: any, productId: any, extraCharge: any) {
    try {
        if (productId) {
            const order = await Order.findById(orderId);
            const orderItem = order.orders.find(
                (item: any) => item._id.toString() === productId
            );

            if (!orderItem) {
                throw new Error('Product not found in order');
            }
            orderItem.extraCharge = parseInt(extraCharge);
            await order.save();

            const updatedOrder = await order.populate({ path: 'orders.product', model: Product });
            return { success: true, message: "Added extra charge" };
        } else {
            const updatedOrder = await MembershipOrder.findByIdAndUpdate(orderId, { extraCharge }, { new: true })
            return { success: true, message: "Added extra charge" };
        }
    } catch (error) {
        console.error("Error updating quantity:", error);
        throw error;
        return { success: false, message: "Failed to add extra charges" };
    }
}

export const updatePaymentStatus = async (orderId: any, isPaid: any, isMembership: any) => {
    try {
        if (isMembership) {
            const res = await MembershipOrder.findByIdAndUpdate(orderId, { isPaid: isPaid }, { new: true })
        } else {
            const res = await Order.findByIdAndUpdate(orderId, { isPaid: isPaid }, { new: true })
        }
        return { success: true, message: isPaid ? "Marked as Paid" : "Marked as Unpaid" };
    } catch (error) {
        return { success: false, message: "Internal server Error" };
        console.log(error)
    }
}


export async function getFilteredOrders(timeRange: any, status: any, inverse: boolean) {
    try {
        await connectToDatabase();
        let query: any = {};

        //inverse bcoz many status possible
        if (status !== null) {
            if (typeof (status) == 'string') {
                query.status = inverse ?
                    { $ne: status }
                    : status
            } else {
                query.status = inverse ?
                    { $nin: status }
                    : { $in: status }
            }
        }

        if (timeRange) {
            const currentTime = new Date();
            const startTime = new Date(currentTime);

            switch (timeRange) {
                case 'morning':
                    startTime.setHours(6, 0, 0);
                    query.time = { $gte: 0, $lt: 12 };
                    break;
                case 'afternoon':
                    startTime.setHours(12, 0, 0);
                    query.time = { $gte: 12, $lt: 15 };
                    break;
                case 'evening':
                    startTime.setHours(17, 0, 0);
                    query.time = { $gte: 15, $lt: 17 };
                    break;
                case 'night':
                    query.time = { $gte: 17, $lt: 24 };
                    break;
            }
        }

        const orders = await Order.find(query)
            .populate({ path: 'orders.product', model: Product }).populate({ path: 'user', model: User, select: "name email contact" }).populate({ path: 'assignedTo', model: User, select: "name" })
            .sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(orders));
    } catch (error) {
        console.error("Error fetching filtered orders:", error);
        throw error;
    }
}

export async function getFilteredMemberships(timeRange: any, status: any, isStatusInverse: boolean, isActive: boolean, isDelivery: boolean, forTomorrow?: boolean) {
    try {
        await connectToDatabase();
        let query: any = {};

        if (status !== null) {
            //This is just for one status
            if (typeof (status) == 'string') {
                query.status = isStatusInverse ?
                    { $ne: status }
                    : status
            }
            //this case agar multiple status
            else {
                query.status = isStatusInverse ?
                    { $nin: status }
                    : { $in: status }
            }
        }


        let utcDate = new Date();
        if (forTomorrow) {
            utcDate.setDate(utcDate.getDate() + 1);
        }
        utcDate.setUTCHours(0, 0, 0, 0);


        if (isActive) {
            query.startDate = { $lte: utcDate }
        }

        if (isDelivery) {
            query.deliveryDates = { $nin: [utcDate] }
            query.postponedDates = { $nin: [utcDate] }
        }

        // time filter
        if (timeRange) {
            const currentTime = new Date();
            const startTime = new Date(currentTime);

            switch (timeRange) {
                case 'morning':
                    startTime.setHours(6, 0, 0);
                    query.time = { $gte: 0, $lt: 12 };
                    break;
                case 'afternoon':
                    startTime.setHours(12, 0, 0);
                    query.time = { $gte: 12, $lt: 15 };
                    break;
                case 'evening':
                    startTime.setHours(17, 0, 0);
                    query.time = { $gte: 15, $lt: 17 };
                    break;
                case 'night':
                    query.time = { $gte: 17, $lt: 24 };
                    break;
            }
        }


        const mermberships = await MembershipOrder.find(query)
            .populate({ path: "assignedTo", model: User, select: "name" })
            .populate({ path: "category", model: MembershipProduct })
            .populate({ path: 'user', model: User, select: "name email contact" })
            .populate({ path: 'products.product', model: Product })
            .sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(mermberships));
    } catch (error) {
        console.error("Error fetching filtered mermberships:", error);
        throw error;
    }
}

// Get all orders
export async function getAllMembership() {
    try {
        await connectToDatabase();
        const membership = await MembershipOrder.find({})
            .populate('category').populate({ path: 'user', model: User, select: "name email contact" })
            .populate({ path: "assignedTo", model: User, select: "name" })
            .populate({ path: 'products.product', model: Product })
            .sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(membership));
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}