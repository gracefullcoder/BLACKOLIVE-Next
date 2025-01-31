import Feature from "@/src/models/extraFeatures";
import connectToDatabase from "@/src/lib/ConnectDb";
import { NextRequest, NextResponse } from "next/server";

// GET all pincodes
export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const feature = await Feature.findOne();
        return NextResponse.json({ success: true, pincodes: feature?.pincodes || [] });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// ADD a new pincode
export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { pincode } = body;

        const feature = await Feature.findOneAndUpdate(
            {},
            { $push: { pincodes: pincode } },
            { new: true, upsert: true } // Create the document if it doesn't exist
        );

        return NextResponse.json({ success: true, pincodes: feature.pincodes }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// UPDATE a specific pincode
export async function PUT(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { index, newPincode } = body;

        const feature = await Feature.findOne();
        if (!feature) throw new Error("Feature document not found");

        feature.pincodes[index] = newPincode; // Update the specific index
        await feature.save();

        return NextResponse.json({ success: true, pincodes: feature.pincodes });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE a specific pincode
export async function DELETE(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { index } = body;

        const feature = await Feature.findOne();
        if (!feature) throw new Error("Feature document not found");

        feature.pincodes.splice(index, 1); // Remove the pincode at the specified index
        await feature.save();

        return NextResponse.json({ success: true, pincodes: feature.pincodes });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
