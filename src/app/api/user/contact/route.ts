import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import AuthConfig from "@/src/lib/auth";
import User from "@/src/models/user";
import connectToDatabase from "@/src/lib/ConnectDb";

export async function PUT(req: Request) {
    try {
        await connectToDatabase();

        const { id, contact } = await req.json();

        console.log(id,contact)

        const user = await User.findByIdAndUpdate(
            id, { contact }, { new: true }
        );

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update contact" },
            { status: 500 }
        );
    }
}