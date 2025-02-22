import connectToDatabase from "@/src/lib/ConnectDb";
import MembershipProduct from "@/src/models/membershipproducts";
import Product from "@/src/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        console.log("requested");
        await connectToDatabase()
        const products = await Product.find();
        const membership = await MembershipProduct.find();
        const params = req.nextUrl.searchParams;

        const type = params.get('type');

        if (type == "all") {
            return NextResponse.json({ products, membership })
        }
        else if (type == "salads") {
            return NextResponse.json({ products })

        } else if (type == "membership") {
            return NextResponse.json({ membership })
        } else {
            return NextResponse.json({ message: "Not a valid request" })
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

