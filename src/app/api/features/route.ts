import { NextRequest, NextResponse } from "next/server"
import Feature from "@/src/models/extraFeatures"
import connectToDatabase from "@/src/lib/ConnectDb";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const feature = await Feature.findOne({});
        return NextResponse.json({
            success: true,
            message: "Extra Features Fetched Successfully",
            data: feature
        })
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: error?.message || "Internal Server Error",
            data: null
        })
    }
}