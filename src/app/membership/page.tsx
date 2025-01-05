import Products from "@/src/components/product/Products";
import { productType } from "@/src/types/product";
import axios from "axios";

async function fetchProducts() {
    try {
        const response = await axios.get(`${process.env.API_BASE_URL}/api/product/?type=membership`);
        if (!response.status || response.status >= 400) {
            throw new Error("Failed to fetch products");
        }
        return [...response.data.membership];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export default async function Home() {
    const products: productType[] = await fetchProducts();

    return (
        <Products products={products} title={"MEMBERSHIP"} />
    );
}
