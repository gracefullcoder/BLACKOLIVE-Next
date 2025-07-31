"use server"

import Razorpay from 'razorpay';
import crypto from 'crypto';
import Product from '../models/product';
import MembershipProduct from '../models/membershipproducts';
import { getPincodeDetails } from './Features';

let instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const validateSignature = async ({ razorpayPaymentId, orderCreationId, razorpaySignature }: any) => {
    const shasum = crypto.createHmac("sha256", process?.env?.RAZORPAY_KEY_SECRET || "");

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    if (digest === razorpaySignature) return true;

    return false;
}

const calculateMembershipPrices = (products: any, discountPercent: any, days: any) => {
    const weeks = days / products?.length;
    const price = products.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * weeks;
    const finalPrice = Math.round(products.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * ((100 - discountPercent) / 100)) * weeks;
    return { price, finalPrice };
}

export const getOrderCost = async ({ productData, isMembership, pincode }: any) => {

    let totalAmount = 0;
    let productDetails;
    if (isMembership) {
        const productDetailsUnsorted = await Product.find({ _id: { $in: productData?.productIds } }).select("title price finalPrice");
        const membershipDetails = await MembershipProduct.findById(productData?.membershipId);
        totalAmount = calculateMembershipPrices(productDetailsUnsorted, membershipDetails.discountPercent, membershipDetails.days).finalPrice;

        productDetails = productData.productIds.map((id: any) => {
            const data = productDetailsUnsorted.find(prod => prod._id.toString() === id.toString());
            return { ...data, product: data._id }
        }
        );
    } else {
        const productIds = productData.map((item: any) => (item?.product?._id));
        const productDetailsDB = await Product.find({ _id: { $in: productIds }, isAvailable: true }).select("title finalPrice");
        productDetails = productDetailsDB.map((prod: any) => {
            const product = productData.find((item: any) => item?.product?._id.toString() == prod._id.toString());
            return { product: prod._id, title: prod.title, priceCharged: prod.finalPrice, quantity: product.quantity }
        })

        if (productDetails.length) {
            totalAmount += productDetails.reduce((sum, item) => (sum + (item?.priceCharged * item?.quantity)), 0);
            const deliveryData = await getPincodeDetails(pincode);

            if (deliveryData == null) {
                return { success: false, message: "Not Deliverable in your Area" }
            } else {
                totalAmount += deliveryData.deliveryCharge;
            }
        }
    }

    return { success: true, totalAmount, productDetails: JSON.parse(JSON.stringify(productDetails)) }
}

export const createRazorpayOrder = async (totalAmount: any) => {
    try {
        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `reciept_${Math.floor(Math.random() * 10000000)}`,
        };

        const order = await instance.orders.create(options);

        return { success: true, order };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Proceed With Cash!" };
    }
}

// router.post("/payment/success", wrapAsync(async (req, res) => {
//     const { orderDetails, orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

//     if (!validateSignature(razorpayPaymentId, orderCreationId, razorpaySignature)) {
//         return res.status(400).json({ msg: "Transaction not legit!" });
//     }

//     let totalAmount = orderDetails.reduce((acc, order) => { return acc + (order.dish.price * order.quantity) }, 0);
//     const userId = req.user;
//     const newOrder = new Order({ orders: orderDetails, totalAmount: totalAmount, user: userId, paymentId: razorpayPaymentId });
//     const order = await newOrder.save();
//     await User.findByIdAndUpdate(userId, { $push: { 'orders': order._id }, cart: [] });
//     let io = req.app.get('socket.io');
//     io.emit("new-order", order);


//     res.status(200).json({
//         success: true, message: "Order Placed Successfully!",
//         orderId: razorpayOrderId,
//         paymentId: razorpayPaymentId
//     });

// }));
