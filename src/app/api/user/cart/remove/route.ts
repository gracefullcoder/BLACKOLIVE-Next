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

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { cart: { product: productId } } },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        return NextResponse.json({
            message: "Removed from cart successfully",
            success: true,
            cart: user.cart
        });
    } catch (error) {
        console.error("Remove from cart error:", error);
        return NextResponse.json({ message: "Server error", success: false }, { status: 500 });
    }
}
