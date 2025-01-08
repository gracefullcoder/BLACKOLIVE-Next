"use client"
import { useState, useEffect } from 'react';
import { IncQty, DecQty } from '@/src/utility/CartFunction';
import { productType } from '@/src/types/product';
import { useSession } from 'next-auth/react';
import { useCartContext } from '@/src/context/CartContext';
import { addToCart, decreaseQuantity, increaseQuantity } from '@/src/actions/Cart';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { createMembership } from '@/src/actions/Order';

function ProductDetails({ product }: { product: productType }) {
    const session = useSession();
    const { items, setItems } = useCartContext();
    const existingCartItem = items.find((item: any) => item?.product?._id === product._id);
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


    //for membership
    const [membershipDetails, setMembershipDetails] = useState<{ time: number, startDate: any }>({ time: 0, startDate: new Date() });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<number>(-1);

    const userAddresses = session?.data?.user?.addresses || [];
    const userContact = session?.data?.user?.contact;
    const hasContact = Boolean(userContact);
    const hasAddress = userAddresses.length > 0;
    const isProfileComplete = hasContact && hasAddress;

    const router = useRouter()

    const validateCheckout = () => {
        if (!membershipDetails.time) {
            toast.error("Please select delivery time!");
            return false;
        }

        console.log(new Date(membershipDetails.startDate) > new Date())

        if (!membershipDetails.startDate || new Date(membershipDetails.startDate) < new Date()) {
            toast.error("Please select a valid date!");
            return false;
        }

        if (selectedAddress === -1) {
            toast.error("Please select delivery address!");
            return false;
        }
        if (!hasContact) {
            toast.error("Please add contact information!");
            return false;
        }
        return true;
    };

    const handleMembership = async () => {
        if (!validateCheckout()) return;

        if (!isProfileComplete) {
            router.push('/user');
            return;
        }

        setIsLoading(true);
        try {

            const response = await createMembership(
                session?.data?.user?._id,
                product._id,
                selectedAddress,
                userContact,
                membershipDetails.time,
                membershipDetails.startDate
            );

            if (response.success) {
                toast.success("Order placed successfully!");
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to create order");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDetailsChange = (e: any) => { setMembershipDetails(prev => { return { ...prev, [e.target.name]: e.target.value } }) }

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

                    <div>
                        {
                            product.bonus ?
                                <div className='flex items-center gap-8'>
                                    <div>
                                        <p className="text-black mt-6 mb-2">Select Start Date</p>
                                        <input type="date" className='border p-2 rounded-3xl'
                                            name='startDate' onChange={(e) => handleDetailsChange(e)} />
                                    </div>
                                    <div>
                                        <p className="text-black mt-6 mb-2">Timings</p>
                                        <select className='border p-2 rounded-3xl'
                                            name="time" onChange={(e) => handleDetailsChange(e)} >
                                            {
                                                product?.timings?.map((t, i) => <option key={i} value={t}>{t}</option>)
                                            }
                                        </select>
                                    </div>
                                </div> :

                                <div>
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
                                </div>
                        }
                    </div>

                    {
                        product.bonus &&
                        <>
                            {/* Address Selection */}
                            {userAddresses.length > 0 ? (
                                <div className="mb-4">
                                    <p className="my-2">Select Delivery Address:</p>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {userAddresses.map((addr: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className={`p-2 border rounded-lg cursor-pointer ${selectedAddress === idx ? 'border-green-500 bg-green-50' : ''}`}
                                                onClick={() => setSelectedAddress(idx)}
                                            >
                                                <p className="text-sm">{addr.address}</p>
                                                <p className="text-xs text-gray-500">{addr.landmark} - {addr.pincode}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                                    <p className="text-sm text-yellow-700">Please add a delivery address in your profile</p>
                                </div>
                            )}

                            {/* Contact Information Warning */}
                            {!hasContact && (
                                <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                                    <p className="text-sm text-yellow-700">Please add contact information in your profile</p>
                                </div>
                            )}
                        </>
                    }


                    {!product.bonus ? (!existingCartItem && (
                        <button
                            className={`w-full p-2 mt-4 text-center text-2xl rounded-3xl mx-auto 
                                      bg-green-600 hover:bg-green-700 text-white cursor-pointer
                                    `}
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    )) :
                        <button
                            className={`w-full p-2 text-center text-2xl rounded-3xl mx-auto 
                                      bg-green-600 hover:bg-green-700 text-white cursor-pointer
                                    `}
                            onClick={handleMembership}
                        >
                            Buy Membership
                        </button>}


                </div>
            </div >
        </section >
    );
}

export default ProductDetails;