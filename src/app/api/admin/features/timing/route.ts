import connectToDatabase from "@/src/lib/ConnectDb";
import Feature from "@/src/models/extraFeatures";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await connectToDatabase();

    const { featureId } = await req.json();

    try {
        const feature = await Feature.findById(featureId).select("deliveryTimings");
        if (!feature) {
            return NextResponse.json({ success: false, message: "Feature not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, deliveryTimings: feature.deliveryTimings });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await connectToDatabase();

    const { startTime, endTime, deliveryTime, display, featureId } = await req.json();

    try {
        const feature = await Feature.findById(featureId);
        if (!feature) {
            return NextResponse.json({ success: false, message: "Feature not found" }, { status: 404 });
        }

        const newTiming = { startTime, endTime, deliveryTime, display };
        feature.deliveryTimings.push(newTiming);
        await feature.save();

        return NextResponse.json({ success: true, message: "Timing added successfully", timing: newTiming });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    await connectToDatabase();

    const { startTime, endTime, deliveryTime, display, featureId, timingId } = await req.json();

    try {
        const feature = await Feature.findById(featureId);
        if (!feature) {
            return NextResponse.json({ success: false, message: "Feature not found" }, { status: 404 });
        }

        const timing = feature.deliveryTimings.id(timingId);
        if (!timing) {
            return NextResponse.json({ success: false, message: "Timing not found" }, { status: 404 });
        }

        timing.startTime = startTime || timing.startTime;
        timing.endTime = endTime || timing.endTime;
        timing.deliveryTime = deliveryTime || timing.deliveryTime;
        timing.display = display || timing.display;

        await feature.save();

        return NextResponse.json({ success: true, message: "Timing updated successfully", timing });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    await connectToDatabase();

    const { featureId, timingId } = await req.json();

    try {
        const feature = await Feature.findById(featureId);
        if (!feature) {
            return NextResponse.json({ success: false, message: "Feature not found" }, { status: 404 });
        }

        const timing = feature.deliveryTimings.id(timingId);
        if (!timing) {
            return NextResponse.json({ success: false, message: "Timing not found" }, { status: 404 });
        }

        timing.remove();
        await feature.save();

        return NextResponse.json({ success: true, message: "Timing deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
