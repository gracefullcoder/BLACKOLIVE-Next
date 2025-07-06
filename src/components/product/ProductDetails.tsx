"use client"
import { useState, useEffect, useRef } from 'react';
import { IncQty, DecQty } from '@/src/utility/CartFunction';
import { useSession } from 'next-auth/react';
import { useCartContext } from '@/src/context/CartContext';
import { addToCart, decreaseQuantity, increaseQuantity } from '@/src/actions/Cart';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { createMembership } from '@/src/actions/Order';
import { featureDetails } from '@/src/actions/Features';
import ExcludedProduct from './ExcludedProduct';
import CustomizeButton from './CustomizeButton';
import { formatTime } from '@/src/utility/timeUtil';
import { displayRazorpay } from '@/src/lib/razorpay';
import { getOrderCost } from '@/src/actions/Payment';
import { handleToast } from '@/src/utility/basic';
import { MembershipCreationType } from '@/src/types/orderType';

function ProductDetails({ product, isMembership }: { product: any, isMembership: boolean }) {
    const session = useSession();
    const { items, setItems } = useCartContext();
    const existingCartItem = items.find((item: any) => item?.product?._id === product._id);
    const [quantity, setQuantity] = useState(existingCartItem ? existingCartItem.quantity : 1);
    const [pincode, setPincode] = useState<any>(null);
    const [pincodes, setPincodes] = useState([])
    const [isDeliverable, setIsDeliverable] = useState<any>(null)
    const porductDetail = useRef<any>(null);
    const [timings, setTimings] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("UPI")

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const initializeWeeklyPlan = () => {
        const plan: any = {};
        if (product?.products?.length != 0) {
            daysOfWeek.forEach((day: any, index: any) => {
                plan[day] = product?.products[index % product?.products?.length];
            });
        }
        return plan;
    };

    const [weeklyPlan, setWeeklyPlan] = useState(isMembership ? initializeWeeklyPlan() : {});
    const [priceDetails, setPriceDetails] = useState({ price: 0, finalPrice: 0 });

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
            const formattedTimings = feature.deliveryTimings.map((t: any) => formatTime(t?.deliveryTime));
            setTimings(formattedTimings);
            setPincodes(feature.pincodes)
        }

        getPincodes()
    }, [])

    useEffect(() => {
        let { price, finalPrice } = calculatePrices(Object.values(weeklyPlan), product?.discountPercent, product?.days);
        setPriceDetails({ price, finalPrice });
    }, [weeklyPlan])

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
    const initMemDetails = { time: product?.timings ? product?.timings[0] : "", startDate: "", message: "" };
    const [membershipDetails, setMembershipDetails] = useState<{ time: string, startDate: any, message: string }>(initMemDetails);
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

        if (getPincode() == null) {
            toast.error("Not deliverable in your area");
            return false;
        }
        if (!hasContact) {
            toast.error("Please add contact information!");
            return false;
        }
        return true;
    };

    const membershipCreation = async (orderDetails: MembershipCreationType,mailData:any, paymentData?: any) => {
        let response;

        if (paymentData) {
            response = await createMembership(orderDetails,mailData, paymentData);
        } else {
            response = await createMembership(orderDetails,mailData);
        }

        if (response.success) setMembershipDetails(initMemDetails)

        return response;
    }

    const handleMembership = async () => {

        if (!isProfileComplete) {
            router.push('/user');
            return;
        }

        if (!validateCheckout()) return;

        setIsLoading(true);
        try {
            const productIds = daysOfWeek.map((day) => (weeklyPlan[day]?._id));
            const membershipData = { productIds, membershipId: product?._id }
            const orderData: any = await getOrderCost({ productData: membershipData, isMembership: true });

            if (!orderData.success) {
                handleToast(orderData);
                return;
            }

            const { totalAmount, productDetails } = orderData;

            const orderDetails: MembershipCreationType = {
                user: session?.data?.user?._id,
                category: product._id,
                address: userAddresses[selectedAddress],
                contact: userContact,
                time: membershipDetails.time,
                startDate: membershipDetails.startDate,
                message: membershipDetails.message,
                days: product.days,
                products: productDetails,
                discountPercent: product.discountPercent,
                adminOrder: null,
                isPaid: false
            }

            if (paymentMethod == "UPI") {
                const additionalDetails = { userDetails: session?.data?.user, productDetails: product };
                orderDetails.isPaid = true;
                displayRazorpay({ totalAmount, orderDetails, additionalDetails, updateFnx: membershipCreation });
            } else {
                const mailData = { finalPrice: totalAmount, title: product?.title }
                let res:any = await membershipCreation(orderDetails,mailData);
                handleToast(res);
                handleToast({success:res?.mailRes,message:"Membership Mail sent!"});
            }

        } catch (error) {
            console.log(error)
            toast.error("Failed to create order");
        } finally {
            setIsLoading(false);
        }
    };

    const isPincodeAvailable = () => {
        const res = pincodes.some((pin: any) => pin?.pincode == pincode);
        setIsDeliverable(res)
    }

    const getPincode = () => {
        if (userAddresses && hasAddress && selectedAddress > -1) {
            const selectedAddr = userAddresses[selectedAddress];
            if (selectedAddr && selectedAddr.pincode) {
                const found = pincodes.find((pin: any) => pin.pincode == selectedAddr.pincode);
                return found ? found : null;
            }
        }

        return null;
    }

    const handleDetailsChange = (e: any) => { setMembershipDetails(prev => { return { ...prev, [e.target.name]: e.target.value } }) }

    const calculatePrices = (products: any, discountPercent: any, days: any) => {
        const weeks = days / products?.length;
        const price = products.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * weeks;
        const finalPrice = Math.round(products.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * ((100 - discountPercent) / 100)) * weeks;
        return { price, finalPrice };
    }

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
                            <p className="text-sm md:text-base line-through text-slate-400">Rs. {isMembership ? priceDetails?.price : product.price}.00</p>
                            <p className="text-lg md:text-xl">Rs. {isMembership ? priceDetails?.finalPrice : product.finalPrice}.00</p>
                        </div>

                        <p className="mt-6 text-sm md:text-base text-slate-600">{product.details}</p>
                        <p className="mt-8 text-sm md:text-base text-slate-600">
                            Delivery Time: {isMembership ? product.timings.map((t: any) => {
                                return `${formatTime(t)} `
                            }) :
                                timings.map((t) => `${t} `)}
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
                                                value={membershipDetails.startDate}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-black mt-6 mb-2">Timings</p>
                                            <select className='border p-2 rounded-3xl'
                                                name="time" onChange={(e) => handleDetailsChange(e)} >
                                                {
                                                    product?.timings?.map((t: any, i: number) => <option key={i} value={t}>{formatTime(t)}</option>)
                                                }
                                            </select>
                                        </div>

                                        <CustomizeButton product={product} weeklyPlan={weeklyPlan} setWeeklyPlan={setWeeklyPlan} daysOfWeek={daysOfWeek} />

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

                        {product.isAvailable ? <>
                            {
                                isMembership &&
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

                            {!isMembership ? (!existingCartItem && (
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
                                        <input
                                            type="text"
                                            onChange={(e) =>
                                                setMembershipDetails((prev) => ({
                                                    ...prev,
                                                    message: e.target.value,
                                                }))
                                            }
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                                            value={membershipDetails?.message}
                                            placeholder="Need Changes?"
                                        />
                                    </div>

                                    {/* //s */}
                                    <div className="my-4">
                                        <label className="block text-gray-600 mb-2">Payment Method:</label>
                                        <div className="flex gap-4">
                                            <div
                                                onClick={() =>
                                                    setPaymentMethod("UPI")
                                                }
                                                className={`flex-1 border rounded-md p-4 text-center cursor-pointer transition-colors ${paymentMethod === "UPI"
                                                    ? "border-green-600 bg-green-50"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                <span className="font-medium">UPI / Prepaid</span>
                                            </div>
                                            <div
                                                onClick={() =>
                                                    setPaymentMethod("COD")
                                                }
                                                className={`flex-1 border rounded-md p-4 text-center cursor-pointer transition-colors ${paymentMethod === "COD"
                                                    ? "border-green-600 bg-green-50"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                <span className="font-medium">Cash on Delivery</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        disabled={isLoading}
                                        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                                        onClick={handleMembership}
                                    >
                                        {isLoading ? "Processing..." : "Buy Membership"}
                                    </button>
                                </div>
                            }
                        </> :

                            <div className={`w-full p-2 mt-4 text-center text-2xl rounded-3xl mx-auto 
                                      bg-red-600 hover:bg-red-700 text-white cursor-pointer`}>
                                Out Of Stock
                            </div>}


                        {/* Available in area */}
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