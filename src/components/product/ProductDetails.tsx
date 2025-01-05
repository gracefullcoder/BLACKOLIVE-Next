"use client"
import { useState, useEffect } from 'react';
import { IncQty, DecQty } from '@/src/utility/CartFunction';
import { productType } from '@/src/types/product';
import { useSession } from 'next-auth/react';
import { useCartContext } from '@/src/context/CartContext';
import { addToCart, decreaseQuantity, increaseQuantity } from '@/src/actions/Cart';

function ProductDetails({ product }: { product: productType }) {
    const session = useSession();
    const { items, setItems } = useCartContext();
    const existingCartItem = items.find((item: any) => item.product._id === product._id);
    const [quantity, setQuantity] = useState(existingCartItem ? existingCartItem.quantity : 1);


    useEffect(() => {
        if (existingCartItem) {
            setQuantity(existingCartItem.quantity);
        }
    }, [existingCartItem]);

    const handleDecrease = async () => {
        if (existingCartItem && quantity > 1) {
            try {
                const res = await decreaseQuantity(session?.data?.user._id, product._id);
                if (res.success) {
                    DecQty(product._id, setItems);
                }
            } catch (error) {
                console.error("Error decreasing quantity:", error);
            }

        } else {
            if (quantity > 1) setQuantity(prev => prev - 1)
        }
    };

    const handleIncrease = async () => {
        if (existingCartItem) {
            try {
                const res = await increaseQuantity(session?.data?.user._id, product._id);
                if (res.success) {
                    IncQty(product._id, setItems);
                }
            } catch (error) {
                console.error("Error increasing quantity:", error);
            }

        } else {
            setQuantity(prev => prev + 1)
        }
    };

    const handleAddToCart = async () => {

        try {
            const res = await addToCart(session?.data?.user._id, product._id, quantity);
            if (res.success) {
                setItems(prev => [...prev, { product: { ...product }, quantity: quantity }]);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }


    };

    return (
        <section className="relative py-16 px-6 md:px-12 lg:px-20">
            <div className="flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-20">
                <img src={product.image} alt={product.title} className="h-[32rem] rounded-3xl" />

                <div className="max-w-xl text-center lg:text-left">
                    <p className="text-sm md:text-base text-slate-400">{product.speciality}</p>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-wide mt-4">{product.title}</h1>

                    <div className="flex md:flex-row items-center gap-2 md:gap-4 mt-4 max-lg:justify-center">
                        <p className="text-sm md:text-base line-through text-slate-400">Rs. {product.price}.00</p>
                        <p className="text-lg md:text-xl">Rs. {product.finalPrice}.00</p>
                    </div>

                    <p className="mt-6 text-sm md:text-base text-slate-600">{product.details}</p>
                    <p className="mt-8 text-sm md:text-base text-slate-600">
                        Delivery Time: 9:00 AM, 12:00 PM, 3:00 PM, 6:00 PM
                    </p>

                    <p className="text-slate-500 mt-6">Quantity</p>
                    <div className="flex gap-8 px-4 py-2 border w-fit rounded-3xl mt-2 items-center text-3xl max-lg:mx-auto">
                        <button
                            className={`cursor-pointer font-bold`}
                            onClick={handleDecrease}
                        >
                            -
                        </button>
                        <div className="text-xl">{quantity}</div>
                        <button
                            className={`cursor-pointer font-bold`}
                            onClick={handleIncrease}
                        >
                            +
                        </button>
                    </div>

                    {!existingCartItem && (
                        <button
                            className={`w-full p-2 mt-4 text-center text-2xl rounded-3xl mx-auto 
                                      bg-green-600 hover:bg-green-700 text-white cursor-pointer
                                    `}
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ProductDetails;