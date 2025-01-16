"use client";
import Button from "../Button";
import ListProducts from "./ListProducts";
import { useState } from "react";
import { productType } from "../../types/product";

function Products({ products, title }: { products: productType[], title: string }) {
  const [isClick, setIsClick] = useState(false);
  const [allProducts, setAllProducts] = useState<productType[]>(products);

  return (
    <section className="relative py-4 px-8 flex flex-col gap-12 items-center">
      <h1 className="font-semibold text-2xl tracking-wide">{title}</h1>
      <ListProducts products={isClick && allProducts.length > 4 ? allProducts : allProducts.slice(0, 4)} />
      {allProducts.length > 4 && <span onClick={() => setIsClick((prev) => !prev)} className={isClick ? "hidden" : ""}>
        <Button />
      </span>}
    </section>
  );
}

export default Products;
