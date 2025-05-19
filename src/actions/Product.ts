"use server"
import connectToDatabase from "../lib/ConnectDb";
import MembershipProduct from "../models/membershipproducts"
import Product from "../models/product";

export const getSpecificProduct = async (id: any) => {
    try {
        await connectToDatabase()
        console.log("specfic product", id, "is")
        let product = await Product.findById(id);

        if (product == null) {
            product = await MembershipProduct.findById(id);
        }
        console.log(product)

        return JSON.parse(JSON.stringify(product));
    } catch (error) {
        console.log(error);
        return { error: "Failed to fetch data", status: 500 };
    }
}


export async function getProducts(type: string) {
    try {
        console.log("requested products");
        await connectToDatabase()
        const products = await Product.find();
        const membership = await MembershipProduct.find();

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

