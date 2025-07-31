// app/api/user/order/route.ts

import { NextRequest, NextResponse } from 'next/server';

// If you need DB connection
import dbConnect from '@/src/lib/ConnectDb';
import { createOrder } from '@/src/actions/Order';
await dbConnect(); // only if your setup requires manual connection

export async function POST(req: NextRequest) {
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

    console.log("kelakela");

    const result = await createOrder(
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
      },
      paymentData
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
