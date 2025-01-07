import HeroSection from "@/src/components/HeroSection";
import Products from "@/src/components/product/Products";
import { productType } from "../types/product";
import axios from "axios";
import { getProducts } from "../actions/Product";

// async function fetchProducts() {
//   try {
//     const response = await axios.get(`${process.env.API_BASE_URL}/api/product/?type=all`);
//     if (!response.status || response.status >= 400) {
//       throw new Error("Failed to fetch products");
//     }
//     return [...response.data.products, ...response.data.membership];
//   } catch (error) {
//     console.log("API_BASE_URL:", process.env.API_BASE_URL);
//     console.error("Error fetching products:", error);
//     return [];
//   }
// }

export default async function Home() {

  const response = await getProducts("all");

  const products = [...response.products, ...response.membership]


  return (
    <>
      <HeroSection />
      <Products products={products} title={"PRODUCTS"} />
    </>
  );
}
