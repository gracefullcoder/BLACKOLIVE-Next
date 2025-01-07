import Products from "@/src/components/product/Products";
import { productType } from "@/src/types/product";
import { getProducts } from "@/src/actions/Product";

export default async function Home() {
    const response: { products: productType[] } = await getProducts("all");
    const products = [...response.products]

    return (
        <Products products={products} title={"SALADS"} />
    );
}
