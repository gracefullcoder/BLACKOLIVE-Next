import ProductCard from './ProductCard'
import { productType } from '@/src/types/product'

function ListProducts({ products }: { products: productType[] }) {

    const calculatePrices = (membershipProducts: any, discountPercent: number, days: number) => {
        const weeks = days / membershipProducts?.products?.length;
        const price = membershipProducts?.products?.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * weeks;
        const finalPrice = Math.round(membershipProducts?.products?.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * ((100 - discountPercent) / 100)) * weeks;
        return { price, finalPrice };
    }

    return (
        <div className='flex flex-wrap w-full justify-center gap-4'>
            {
                products.map((product, idx) => {
                    {
                        if (product?.products) {
                            let { price, finalPrice } = calculatePrices(product, product.discountPercent || 0, product.days);
                            return <ProductCard key={idx} _id={product._id} image={product.image} title={product.title} speciality={product.speciality} price={price} finalPrice={finalPrice} details={product.details} />

                        } else {
                            return <ProductCard key={idx} _id={product._id} image={product.image} title={product.title} speciality={product.speciality} price={product.price} finalPrice={product.finalPrice} details={product.details} />
                        }
                    }
                })
            }
        </div>
    )
}

export default ListProducts