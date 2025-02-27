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
            return JSON.parse(JSON.stringify({ products, membership }))
        }
        else if (type == "salads") {
            return JSON.parse(JSON.stringify({ products }))

        } else if (type == "membership") {
            return JSON.parse(JSON.stringify({ membership }))
        } else {
            return JSON.parse(JSON.stringify({ message: "Not a valid request" }))
        }
    } catch (error) {
        console.log(error)
        return { error: "Failed to fetch data", status: 500 };
    }
}

