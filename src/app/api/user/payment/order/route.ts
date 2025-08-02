import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount } = body;
    console.log("this is the order",amount)

    if (!amount || isNaN(amount)) {
      return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
    }

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(Math.random() * 10000000)}`,
      offers:["R0PwIIu6LmqX4X"]
    };

    const order = await instance.orders.create(options);


    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
