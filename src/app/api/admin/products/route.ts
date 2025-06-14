import connectToDatabase from "@/src/lib/ConnectDb";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/src/models/product";
import MembershipProduct from "@/src/models/membershipproducts";
import { revalidatePath } from "next/cache";


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
        console.log(data);

        if (data.isMembership) {
            product = await MembershipProduct.create({
                title: data.title,
                details: data.details,
                image: data.image,
                fileId: data.fileId,
                speciality: data.speciality,
                isAvailable: data.isAvailable ?? true,
                bonus: data.bonus,
                days: data.days,
                timings: data.timings.split(','),
                products: data.products,
                discountPercent: Number(data.discountPercent),
                // customizations: [data.customizations],
                // additionals: [data.additionals]  
            });
            revalidatePath("/membership")
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
            revalidatePath("/salads")
        }

        revalidatePath("/");

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

export async function PUT(req: Request) {
    try {
        await connectToDatabase()
        const { productId, isAvailable, isMembership } = await req.json();

        if (isMembership) {
            const product = await MembershipProduct.findByIdAndUpdate(productId, { isAvailable })
        } else {
            const product = await Product.findByIdAndUpdate(productId, { isAvailable })
        }

        return NextResponse.json({ success: true, message: "Updated!" })
    } catch (error) {

    }
}

export async function PATCH(req: Request) {
    try {
        await connectToDatabase();
        const data = await req.json();
        let product;

        if (data.isMembership) {
            product = await MembershipProduct.findByIdAndUpdate(data.id, {
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
                timings: data.timings,
                products: data.products,
                discountPercent:data.discountPercent
            });
            revalidatePath("/membership");
        } else {
            product = await Product.findByIdAndUpdate(data.id, {
                title: data.title,
                details: data.details,
                image: data.image,
                fileId: data.fileId,
                speciality: data.speciality,
                price: data.price,
                finalPrice: data.finalPrice,
                isAvailable: data.isAvailable ?? true
            });
            revalidatePath("/salads");
        }
        revalidatePath("/");

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