import { NextRequest, NextResponse } from 'next/server';
import User from '@/src/models/user';
import connectToDatabase from '@/src/lib/ConnectDb';
import Order from "@/src/models/order";
import MembershipOrder from "@/src/models/membershipOrder";
import Product from '@/src/models/product';

export async function GET(request: NextRequest, { params }: { params: any }) {
    try {
        await connectToDatabase();

        const { userId } = await params;

        const user = await User.findById(userId)
            .populate({
                path: "orderDetails",
                model: Order,
                populate: {
                    path: "orders.product",
                    model: Product,
                },
            })
            .populate({
                path: "membershipDetails",
                model: MembershipOrder,
                populate: {
                    path: "category",
                    model: Product,
                },
            })
            .populate("cart.product");

        console.log(user);

        if (!user) {
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
    try {
        await connectToDatabase();
        const { userId } = params;
        const { isAdmin } = await request.json();
        console.log(userId, isAdmin);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isAdmin },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}
