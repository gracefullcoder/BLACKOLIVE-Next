import ProductCard from './ProductCard'
import { productType } from '@/src/types/product'

function ListProducts({ products }: { products: productType[] }) {
    return (
        <div className='flex flex-wrap w-full justify-center gap-4'>
            {
                products.map((product, idx) => (
                    <ProductCard key={idx} _id={product._id} image={product.image} title={product.title} speciality={product.speciality} price={product.price} finalPrice={product.finalPrice} details={product.details} />
                ))
            }
        </div>
    )
}

export default ListProducts