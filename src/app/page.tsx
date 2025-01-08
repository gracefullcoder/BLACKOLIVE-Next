import HeroSection from "@/src/components/HeroSection";
import Products from "@/src/components/product/Products";
import { productType } from "../types/product";
import { getProducts } from "../actions/Product";

export default async function Home() {

  const response: { products: productType[], membership: productType[] } = await getProducts("all");
  const products = [...response.products, ...response.membership]


  return (
    <>
      <HeroSection />
      <Products products={products} title={"PRODUCTS"} />
    </>
  );
}

export const dynamic = 'force-dynamic'