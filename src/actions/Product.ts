"use server"

import MembershipProd from "../models/membershipproducts"
import Product from "../models/product";

export const getSpecificProduct = async (id: any) => {
    let product = await Product.findById(id) || await MembershipProd.findById(id);

    return JSON.parse(JSON.stringify(product));
}