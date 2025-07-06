import Products from "@/src/components/product/Products";
import { productType } from "@/src/types/product";
import { getProducts } from "@/src/actions/Product";

export default async function Home() {

    const response: { membership: productType[] } = await getProducts("membership");
    console.log(response);

    const products = [...response.membership]

    return (
        <Products products={products} title={"MEMBERSHIP"} />
    );
}
