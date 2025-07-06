import ProductDetails from '@/src/components/product/ProductDetails'
import React from 'react'
import { getSpecificProduct } from '@/src/actions/Product'

async function renderProduct({ searchParams }: { searchParams: any }) {
    const params = await searchParams
    const id = params.id
    const product = await getSpecificProduct(id);

    return (
        <ProductDetails product={product.product} isMembership={product.isMembership} />
    )
}

export default renderProduct

