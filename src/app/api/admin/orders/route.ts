import connectToDatabase from "@/src/lib/ConnectDb";
import Order from "@/src/models/order";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    await connectToDatabase()
    console.log("fadfs")
    const orders = await Order.find().populate('orders.product');
    console.log(orders)
    return NextResponse.json(orders);
}