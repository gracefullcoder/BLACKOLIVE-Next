import connectToDatabase from "@/src/lib/ConnectDb";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/src/models/product";
import MembershipProduct from "@/src/models/membershipproducts";


export async function GET(req: NextRequest) {
    connectToDatabase();

    const allProducts = await Product.find();

    NextResponse.json(allProducts);
}

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const data = await req.json();
        let product;

        if (data.isMembership) {
            product = await MembershipProduct.create({
                title: data.title,
                details: data.details,
                image: data.image,
                fileId: data.fileId,
                speciality: data.speciality,
                price: data.price,
                finalPrice: data.finalPrice,
                isAvailable: data.isAvailable ?? true,
                bonus: data.bonus,
                days: data.days,
                timings : data.timings.split(',')
            });
        } else {
            product = await Product.create({
                title: data.title,
                details: data.details,
                image: data.image,
                fileId: data.fileId,
                speciality: data.speciality,
                price: data.price,
                finalPrice: data.finalPrice,
                isAvailable: data.isAvailable ?? true
            });
        }

        return NextResponse.json(
            { message: "Product created successfully", product },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error creating product", error },
            { status: 500 }
        );
    }
}