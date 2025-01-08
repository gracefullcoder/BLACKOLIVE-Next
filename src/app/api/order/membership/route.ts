import connectToDatabase from "@/src/lib/ConnectDb";
import MembershipOrder from "@/src/models/membershipOrder";
import User from "@/src/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const { id, userId } = await req.json();

        const membershipDetails = await User.findById(userId).select("membershipDetails");

        if (membershipDetails.contains(id)) {
            const data = await MembershipOrder.findById(id).populate({path:'category',model:"MembershipProduct"});

            return NextResponse.json({ success: true, details: data });
        }
        return NextResponse.json({ success: false, message: "Not able to find order" });


    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Internal Server Error" });
    }
}