import ProductCard from './ProductCard'
import { productType } from '@/src/types/product'

function ListProducts({ products }: { products: productType[] }) {

    const calculatePrices = (memProductIds: any, discountPercent: any) => {
        const membershipProducts = products.filter((p: any) => (memProductIds.includes(p?._id)));
        const price = membershipProducts.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0);
        const finalPrice = Math.round(membershipProducts.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * ((100 - discountPercent) / 100));
        return { price, finalPrice };
    }

    return (
        <div className='flex flex-wrap w-full justify-center gap-4'>
            {
                products.map((product, idx) => {
                    {
                        if (product?.products) {
                            let { price, finalPrice } = calculatePrices(product.products, product.discountPercent);
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