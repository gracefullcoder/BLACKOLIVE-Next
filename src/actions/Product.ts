"use server"
import connectToDatabase from "../lib/ConnectDb";
import MembershipProduct from "../models/membershipproducts"
import Product from "../models/product";

export const getSpecificProduct = async (id: any) => {
    try {
        await connectToDatabase()
        console.log("specfic product", id, "is")
        let product = await Product.findById(id);
        let isMembership = false;

        if (product == null) {
            product = await MembershipProduct.findById(id).populate({ model: Product, path: "products" });
            isMembership = true
        }

        console.log(product)

        return { product: JSON.parse(JSON.stringify(product)), isMembership };
    } catch (error) {
        console.log(error);
        return { error: "Failed to fetch data", isMembership: false, status: 500 };
    }
}


export async function getProducts(type: string) {
    try {
        console.log("requested products");
        await connectToDatabase()
        const products = await Product.find();
        let membership;

        if (type == "all" || type == "membership") membership = await MembershipProduct.find().populate({ path: "products", model: Product });

        console.log(products, membership)

        if (type == "all") {
            return JSON.parse(JSON.stringify({ success: true, message: "All Products Fetched", products, membership }))
        }
        else if (type == "salads") {
            return JSON.parse(JSON.stringify({ success: true, message: "All Salads Fetched", products }))

        } else if (type == "membership") {
            return JSON.parse(JSON.stringify({ success: true, message: "All Membership Fetched", membership }))
        } else {
            return JSON.parse(JSON.stringify({ message: "Not a valid request" }))
        }
    } catch (error: any) {
        console.log(error)
        return { success: true, message: error?.message || "Failed to fetch data", error: "Failed to fetch data", status: 500 };
    }
}

