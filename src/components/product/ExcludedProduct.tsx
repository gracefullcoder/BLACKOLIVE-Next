"use client"
import { getProducts } from '@/src/actions/Product';
import React, { useEffect, useState } from 'react'
import Products from './Products';

function ExcludedProduct({ id }: any) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            let allProducts: any = await getProducts("all");
            allProducts = [...allProducts.products, ...allProducts.membership]
            setProducts(allProducts.filter((product: any) => (product._id != id)))
        }

        fetchProduct();
    }, [])
    return (
        <Products products={products} title={"Other Products"} />
    )
}

export default ExcludedProduct