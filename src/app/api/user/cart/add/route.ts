import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/src/lib/ConnectDb";
import User from "@/src/models/user";

export async function POST(req: NextRequest) {
    try {
        const { userId, productId, quantity } = await req.json();

        if (!userId || !productId || typeof quantity !== "number") {
            return NextResponse.json({ message: "Invalid payload", success: false }, { status: 400 });
        }

        await connectToDatabase();

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { cart: { product: productId, quantity } } },
            { new: true }
        );

        return NextResponse.json({
            message: "Added to cart successfully",
            success: true,
            cart: updatedUser?.cart
        });
    } catch (error) {
        console.error("Add to cart error:", error);
        return NextResponse.json({ message: "Server error", success: false }, { status: 500 });
    }
}
