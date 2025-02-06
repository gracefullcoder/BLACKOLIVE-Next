"use client";
import Button from "../Button";
import ListProducts from "./ListProducts";
import { useState } from "react";
import { productType } from "../../types/product";

function Products({ products, title }: { products: productType[]; title: string }) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const displayedProducts = showAllProducts ? products : products.slice(0, 4);

  return (
    <section className="relative py-12 px-8 flex flex-col items-center bg-gray-50 rounded-lg shadow-md">
      <h1 className="font-bold text-3xl text-gray-800 mb-8 tracking-wide uppercase">
        {title}
      </h1>
      <ListProducts products={displayedProducts} />
      {products.length > 4 && (
        <div className="mt-8">

          <button className={`rounded-3xl bg-black px-8 py-2 text-white w-fit`} onClick={() => setShowAllProducts((prev) => !prev)}>
            {showAllProducts ? "Show Less" : "Show More"}
          </button>

        </div>
      )}
    </section>
  );
}

export default Products;