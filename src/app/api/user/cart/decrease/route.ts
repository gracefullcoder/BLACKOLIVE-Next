import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/src/lib/ConnectDb";
import User from "@/src/models/user";

export async function POST(req: NextRequest) {
  try {
    const { userId, productId } = await req.json();
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
    }

    const cartItem = user.cart.find(
      (item: any) => item.product.toString() === productId
    );

    if (!cartItem) {
      return NextResponse.json({ message: "Item not in cart", success: false }, { status: 404 });
    }

    if (cartItem.quantity <= 1) {
      return NextResponse.json({ message: "Quantity already at minimum", success: false }, { status: 400 });
    }

    cartItem.quantity -= 1;

    await user.save();

    return NextResponse.json({ message: "Quantity decreased", success: true, cart: user.cart });
  } catch (err) {
    console.error("Error in decreasing quantity:", err);
    return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
  }
}
