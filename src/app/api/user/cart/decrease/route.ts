import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/src/lib/ConnectDb";
import User from "@/src/models/user";

export async function POST(req: NextRequest) {
    try {
        const { userId, productId } = await req.json();

        if (!userId || !productId) {
            return NextResponse.json({ message: "Invalid payload", success: false }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findOneAndUpdate(
            {
                _id: userId,
                "cart.product": productId
            },
            {
                $inc: { "cart.$.quantity": -1 }
            },
            {
                new: true
            }
        );

        if (!user) {
            return NextResponse.json({ message: "Product not found in cart", success: false }, { status: 404 });
        }

        return NextResponse.json({
            message: "Decreased quantity",
            success: true,
            cart: user.cart
        });
    } catch (error) {
        console.error("Decrease quantity error:", error);
        return NextResponse.json({ message: "Server error", success: false }, { status: 500 });
    }
}
