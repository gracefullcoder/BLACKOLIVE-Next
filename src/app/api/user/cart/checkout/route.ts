import connectToDatabase from '@/src/lib/ConnectDb';
import Order from '@/src/models/order';
import User from '@/src/models/user';
import { orderEmailTemplate, resendMail } from '@/src/utility/mail';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const validateSignature = async ({ razorpayPaymentId, orderCreationId, razorpaySignature }: any) => {
    const shasum = crypto.createHmac("sha256", process?.env?.RAZORPAY_KEY_SECRET || "");

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    if (digest === razorpaySignature) return true;

    return false;
}

export async function POST(req: NextRequest) {
  await connectToDatabase(); // if you're not auto-connecting elsewhere

  try {
    const body = await req.json();

    const {
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
      adminOrder,
      paymentData 
    } = body;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (paymentData) {
      const isValid = await validateSignature(paymentData);
      if (!isValid) {
        return NextResponse.json({ success: false, message: 'Signature mismatch. Request flagged.' }, { status: 403 });
      }
      console.log("Razorpay payment verified:", isValid);
    }

    const selectedAddress = user.addresses[addressId];
    if (!selectedAddress) {
      return NextResponse.json({ success: false, message: 'Address not found' }, { status: 400 });
    }

    const newOrder = await Order.create({
      user: userId,
      orders: orderItems,
      address: selectedAddress,
      contact: contact || user.contact,
      time,
      overallRating: 0,
      message,
      isPaid: typeof isPaid === "boolean" ? isPaid : false,
      paymentId,
      deliveryCharge,
      adminOrder
    });

    await User.findByIdAndUpdate(userId, {
      $push: { orderDetails: newOrder._id },
      $set: { cart: [] }
    });

    const orderDetails = {
      userName: user.name,
      orderId: newOrder._id,
      address: selectedAddress,
      contact,
      time,
      orderItems,
      totalAmount
    };

    const mailRes = await resendMail({
      email: user.email,
      subject: "Order Confirmation",
      html: orderEmailTemplate(orderDetails)
    });

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      orderId: newOrder._id,
      mailRes
    });

  } catch (error) {
    console.error("Error in order API:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
