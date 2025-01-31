import Feature from "@/src/models/extraFeatures";
import connectToDatabase from "@/src/lib/ConnectDb";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const feature = await Feature.findOne(); 
            revalidatePath("/");
        return NextResponse.json({ success: true, topBarMessages: feature?.topBarMessages || [] });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { message } = body;

        const feature = await Feature.findOneAndUpdate(
            {},
            { $push: { topBarMessages: message } },
            { new: true, upsert: true }
        );
        revalidatePath("/");
        return NextResponse.json({ success: true, topBarMessages: feature.topBarMessages }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { index, newMessage } = body;

        const feature = await Feature.findOne();
        if (!feature) {
            throw new Error("Feature document not found");
        }

        feature.topBarMessages[index] = newMessage;
        await feature.save();
        revalidatePath("/");
        return NextResponse.json({ success: true, topBarMessages: feature.topBarMessages });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { index } = body;

        const feature = await Feature.findOne();
        if (!feature) {
            throw new Error("Feature document not found");
        }

        feature.topBarMessages.splice(index, 1);
        await feature.save();
        revalidatePath("/");
        return NextResponse.json({ success: true, topBarMessages: feature.topBarMessages });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
