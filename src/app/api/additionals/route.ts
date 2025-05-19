import Additionals from "@/src/models/additionals";
import { handleApiError } from "@/src/utility/basic";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const data = await Additionals.find();
        return NextResponse.json({ success: true, message: "Additonals fetched", additonals: data });

    } catch (error) {
        return handleApiError(NextResponse, error, "Failed to fetch Additonals");
    }
}