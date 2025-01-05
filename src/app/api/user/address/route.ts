import { NextResponse } from "next/server";
import User from "@/src/models/user";
import connectToDatabase from "@/src/lib/ConnectDb";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { id, address } = await req.json();


        console.log( id, address);
        
        const user = await User.findByIdAndUpdate(
            id,
            { $push: { addresses: address } },
            { new: true }
        );

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to add address" },
            { status: 500 }
        );
    }
}