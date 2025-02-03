import HeroSection from "@/src/components/HeroSection";
import Products from "@/src/components/product/Products";
import { productType } from "../types/product";
import { getProducts } from "../actions/Product";
import { featureDetails } from "../actions/Features";
import MessageBar from "../components/MessageBar";

export default async function Home() {

  const response: { products: productType[], membership: productType[] } = await getProducts("all");
  const products = [...response.products, ...response.membership]
  const features = await featureDetails()

  return (
    <>
      <MessageBar messages={features?.topBarMessages || []} />
      <HeroSection features={features} />
      <Products products={products} title={"PRODUCTS"} />
    </>
  );
}

// export const dynamic = 'force-dynamic'