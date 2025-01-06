"use server"
import MembershipProd from "../models/membershipproducts"
import Product from "../models/product";

export const getSpecificProduct = async (id: any) => {
    try {
        console.log("specfic product")
        let product = await Product.findById(id);

        if (product == null) {
            product = await MembershipProd.findById(id);
        }
        console.log(product)

        return JSON.parse(JSON.stringify(product));
    } catch (error) {
        console.log(error);
    }
}