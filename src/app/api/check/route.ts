import { NextRequest, NextResponse } from "next/server"
import { createMemberships, createProducts } from "@/src/utility/initDB"
import Feature from "@/src/models/extraFeatures"
import connectToDatabase from "@/src/lib/ConnectDb";

export async function GET(req: NextRequest) {
    // await createProducts()
    // await createMemberships()
    try {
        await connectToDatabase();
        const feature = await Feature.findOne({});
        return NextResponse.json({
            success: true,
            message: "Handler",
            data: feature
        })
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: error?.message || "Internal Server Error"
        })
    }
}