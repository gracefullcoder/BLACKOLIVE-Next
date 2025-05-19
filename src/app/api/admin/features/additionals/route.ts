import Additionals from "@/src/models/additionals";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { label, price, description } = await req.json();

        const newAddition = new Additionals({ label, price, description });
        await newAddition.save();

        return NextResponse.json({ message: "Additonal Created", success: true });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ message: error?.message || "Failed to create Additional", success: false });
    }
}