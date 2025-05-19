"use client"
import { useState, useEffect, useRef } from 'react';
import { IncQty, DecQty } from '@/src/utility/CartFunction';
import { productType } from '@/src/types/product';
import { useSession } from 'next-auth/react';
import { useCartContext } from '@/src/context/CartContext';
import { addToCart, decreaseQuantity, increaseQuantity } from '@/src/actions/Cart';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { createMembership } from '@/src/actions/Order';
import { featureDetails } from '@/src/actions/Features';
import ExcludedProduct from './ExcludedProduct';
import { Message } from '@/src/utility/SendMessage';

function ProductDetails({ product }: { product: productType }) {
    const session = useSession();
    const { items, setItems } = useCartContext();
    const existingCartItem = items.find((item: any) => item?.product?._id === product._id);
    const [quantity, setQuantity] = useState(existingCartItem ? existingCartItem.quantity : 1);
    const [pincode, setPincode] = useState<any>(null);
    const [pincodes, setPincodes] = useState([])
    const [isDeliverable, setIsDeliverable] = useState<any>(null)
    const porductDetail = useRef<any>(null);

    useEffect(() => {
        if (porductDetail.current) {
            porductDetail?.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, []);


    useEffect(() => {
        if (existingCartItem) {
            setQuantity(existingCartItem.quantity);
        }
    }, [existingCartItem]);

    useEffect(() => {
        const getPincodes = async () => {
            const feature = await featureDetails();
            setPincodes(feature.pincodes)
        }

        getPincodes()
    }, [])

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
            setIsLoading(true);
            const res = await addToCart(session?.data?.user._id, product._id, quantity);
            if (res.success) {
                setItems(prev => [...prev, { product: { ...product }, quantity: quantity }]);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error adding to cart:", error);
            setIsLoading(false)
        }
    };


    //for membership
    const [membershipDetails, setMembershipDetails] = useState<{ time: number, startDate: any, message: string }>({ time: product?.timings ? product?.timings[0] : 0, startDate: new Date(), message: "" });
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

        const currDate = new Date()
        const startDate = new Date(membershipDetails.startDate)
        currDate.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);

        console.log(startDate, currDate)

        if (!membershipDetails.startDate || startDate <= currDate) {
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
                membershipDetails.startDate,
                membershipDetails.message
            );

            if (response.success) {
                toast.success("Order placed successfully!");
            } else {
                toast.error(response.message);
            }

            if (response?.mailRes?.success) {
                toast.success("Order Mail Sent")
            }


        } catch (error) {
            toast.error("Failed to create order");
        } finally {
            setIsLoading(false);
        }
    };

    const isPincodeAvailable = () => {
        const res = pincodes.some((pin) => pincode == pin);
        setIsDeliverable(res)
    }

    const handleDetailsChange = (e: any) => { setMembershipDetails(prev => { return { ...prev, [e.target.name]: e.target.value } }) }

    const formattedTime = (time: any): string => {
        let [hrs, min] = time.split(":").map(Number); // Convert to numbers

        let period = "AM";
        if (hrs >= 12) {
            period = "PM";
            if (hrs > 12) hrs -= 12;
        } else if (hrs === 0) {
            hrs = 12;
        }

        return `${hrs.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} ${period}`;
    };


    return (
        <section >
            <div ref={porductDetail} />
            <div className="relative py-16 px-6 md:px-12 lg:px-20">
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
                                                name='startDate' onChange={(e) => handleDetailsChange(e)}
                                                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-black mt-6 mb-2">Timings</p>
                                            <select className='border p-2 rounded-3xl'
                                                name="time" onChange={(e) => handleDetailsChange(e)} >
                                                {
                                                    product?.timings?.map((t, i) => <option key={i} value={t}>{formattedTime(t)}</option>)
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

                        {false && product.isAvailable ? <>
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

                                    {!hasContact && (
                                        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                                            <p className="text-sm text-yellow-700">Please add contact information in your profile</p>
                                        </div>
                                    )}
                                </>
                            }

                            {!product.bonus ? (!existingCartItem && (
                                <div className='px-8'>
                                    <button
                                        disabled={isLoading}
                                        className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                                        onClick={handleAddToCart}
                                    >
                                        {isLoading ? 'Processing...' : 'Add to Cart'}
                                    </button>
                                </div>

                            )) :

                                <div>
                                    <div className="my-4">
                                        <label className="block text-gray-600 mb-2">Message:</label>

                                        <input type="text" onChange={(e: any) => setMembershipDetails((prev: any) => ({ ...prev, message: e.target.value }))}
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                                            placeholder='Need Changes ?' />
                                    </div>
                                    {/* <button
                                        className={`w-full p-2 text-center text-2xl rounded-3xl mx-auto 
                                      bg-green-600 hover:bg-green-700 text-white cursor-pointer
                                    `}
                                        onClick={handleMembership}
                                    >
                                        Buy Membership
                                    </button> */}
                                    <button
                                        disabled={isLoading}
                                        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                                        onClick={handleMembership}
                                    >
                                        {isLoading ? 'Processing...' : 'Buy Membership'}
                                    </button>



                                </div>}
                        </> :

                            <div className={`w-fit p-2 px-4 mt-4 text-center text-2xl rounded-3xl mx-auto 
                                      bg-green-600 hover:bg-green-700 text-white cursor-pointer`}
                                      onClick={() => Message(`I want to Buy \nItem : ${product.title} \nQuanity : ${quantity}`)}>
                                Click to Order on Whatsapp! 
                            </div>
                        }


                        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4 mt-4 border-t border-black">
                            <p className="text-sm font-medium text-gray-700 mb-3">
                                Check if Deliverable in Your Area
                            </p>
                            <div className='flex gap-2 w-full justify-center'>
                                <input
                                    type="number"
                                    placeholder="Enter your Pincode"
                                    className="w-min-20 border border-gray-300 rounded-md p-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    onChange={(e) => setPincode(e.target.value)}
                                />
                                <button
                                    onClick={isPincodeAvailable}
                                    className="w-16 h-fit py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-all"
                                >
                                    Check
                                </button>
                            </div>
                            {isDeliverable !== null && (
                                <p
                                    className={`text-sm font-medium ${isDeliverable ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    {isDeliverable
                                        ? 'Deliverable in your area'
                                        : 'Not Deliverable in your area'}
                                </p>
                            )}
                        </div>



                    </div>
                </div >
            </div>

            <div>
                <ExcludedProduct id={product?._id} />
            </div>
        </section >
    );
}

export default ProductDetails;