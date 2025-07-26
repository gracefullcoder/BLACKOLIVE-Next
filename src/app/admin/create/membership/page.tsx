"use client";
import React, { useEffect, useState } from "react";
import { UserData } from "@/src/types/user";
import ShowProducts from "@/src/components/adminorders/create/ShowProducts";
import AdminOrder from "@/src/components/adminorders/create/AdminOrder";
import { toast } from "react-toastify";
import { createMembership } from "@/src/actions/Order";
import CustomizeButton from "@/src/components/product/CustomizeButton";
import { featureDetails } from "@/src/actions/Features";
import { displayRazorpay } from "@/src/lib/razorpay";
import { MembershipCreationType } from "@/src/types/orderType";
import { formatTime } from "@/src/utility/timeUtil";

export default function Page() {

    const [user, setUser] = useState<any>(null);
    const [memberships, setMemberships] = useState<any>([])
    const [membershipDetails, setMembershipsDetails] = useState<any>({
        user: "",
        adminOrder: {
            customerName: ""
        },
        orders: [],
        address: null,
        contact: null,
        time: null,
        startDate: null,
        isPaid: false,
        extraCharge: "",
        message: ""
    })
    const [pincodes, setPincodes] = useState<any[]>([]);
    const [paymentMethod, setPaymentMethod] = useState("COD");

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const [weeklyPlan, setWeeklyPlan] = useState({});

    const [priceDetails, setPriceDetails] = useState({ price: 0, finalPrice: 0 });

    console.log(weeklyPlan);

    useEffect(() => {
        const fetchPincodes = async () => {
            const features = await featureDetails();
            setPincodes(features?.data?.pincodes || []);
        };
        fetchPincodes();
    }, []);

    const getPincode = () => {
        if (user && membershipDetails.address !== null && user.addresses && user.addresses.length > 0) {
            const selectedAddr = user.addresses[membershipDetails.address];
            if (selectedAddr && selectedAddr.pincode) {
                const found = pincodes.find((pin: any) => pin.pincode == selectedAddr.pincode);
                return found ? found : null;
            }
        }

        return null;
    }

    useEffect(() => {
        if (membershipDetails?.orders?.length) {
            const { price, finalPrice } = calculatePrices(Object.values(weeklyPlan), membershipDetails.orders[0].discountPercent, membershipDetails?.orders[0]?.days);
            setPriceDetails({ price: price, finalPrice });
        }
    }, [weeklyPlan, membershipDetails?.orders[0]?.discountPercent])

    const membershipCreation = async (orderDetails: MembershipCreationType, mailData: any, paymentData?: any) => {
        let response;

        if (paymentData) {
            response = await createMembership(orderDetails, mailData, paymentData);
        } else {
            response = await createMembership(orderDetails, mailData);
        }

        return response;
    }

    const handleNewMembership = async () => {
        if (membershipDetails.address === null) {
            toast.error("Please select an address for the order.");
            return;
        }

        if (getPincode() == null) {
            toast.error("Not Deliverable in that area please add first");
            return;
        }

        if (membershipDetails.orders.length == 0) {
            toast.error("Please select a Membership.");
            return;
        }

        if (!parseInt(membershipDetails.time)) {
            toast.error("Please select any Time for the order.");
            return;
        }

        if (!membershipDetails.date) {
            toast.error("Please select startDate.");
            return;
        }

        const formatProductDetails = Object.values(weeklyPlan).map((p: any) => {
            return { product: p._id, price: p.price, finalPrice: p.finalPrice }
        })

        const membershipData: MembershipCreationType = {
            user: user?._id || "",
            category: membershipDetails.orders[0]._id,
            address: user?.addresses[membershipDetails?.address],
            contact: membershipDetails.contact,
            time: membershipDetails.time,
            startDate: new Date(membershipDetails.date),
            message: membershipDetails.message,
            days: membershipDetails.orders[0].days,
            products: formatProductDetails,
            discountPercent: membershipDetails.discountPercent,
            extraCharge: parseInt('0' + membershipDetails.extraCharge),
            isPaid: membershipDetails.isPaid,
            adminOrder: membershipDetails.adminOrder
        };

        const additionalDetails = {
            userDetails: user,
            productDetails: {
                title: membershipDetails.orders[0].title,
                description: membershipDetails.orders[0].description,
                image: "https://ik.imagekit.io/vaibhav11/BLACKOLIVE/tr:w-40,h-40/newlogo.png?updatedAt=1750700640825",
            }
        };

        if (paymentMethod === "UPI") {
            displayRazorpay({
                orderDetails: membershipData,
                totalAmount: priceDetails.finalPrice,
                additionalDetails,
                updateFnx: membershipCreation
            });
        } else {
            const mailData = { finalPrice: priceDetails.finalPrice, title: membershipDetails.orders[0]?.title }

            const response = await membershipCreation(membershipData, mailData);

            if (response.success) {
                toast.success(response.message);
                setMembershipsDetails({
                    user: "",
                    adminOrder: {
                        customerName: ""
                    },
                    orders: [],
                    address: null,
                    contact: null,
                    time: null,
                    date: null,
                    isPaid: false,
                    extraCharge: "",
                    message: ""
                });
                setUser(null);
                setWeeklyPlan({});
            } else {
                toast.error(response.message || "Failed to create membership");
            }
        }
    };

    const removeProduct = (pId: any) => {
        setMembershipsDetails((prev: any) => ({ ...prev, orders: prev.orders.filter((order: any) => order.product != pId) }))
    }

    const calculatePrices = (products: any, discountPercent: any, days: any) => {
        const weeks = days / products?.length;
        const price = products.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * weeks;
        const finalPrice = Math.round(products.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * ((100 - discountPercent) / 100)) * weeks;
        return { price, finalPrice };
    }

    return (
        <div className="container mx-auto p-6 space-y-6">

            <AdminOrder user={user} setUser={setUser} orderDetails={membershipDetails} setOrderDetails={setMembershipsDetails} />

            {user?.email &&
                <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
                    <h3 className="font-semibold text-lg mb-4 text-gray-700">Membership Summary</h3>


                    <ShowProducts orderDetails={membershipDetails} setWeeklyPlan={setWeeklyPlan} products={memberships} setProducts={setMemberships} setOrderDetails={setMembershipsDetails} isMembership={true} daysOfWeek={daysOfWeek} />

                    <div className="mt-6">
                        <h3 className="font-semibold text-lg mb-4">Orders</h3>
                        <div className="space-y-4">
                            {membershipDetails.orders.map((order: any, idx: any) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md"
                                >
                                    <div className="font-medium text-gray-800">
                                        Product: {order.title}
                                        <p className="">Price : {priceDetails.finalPrice}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <CustomizeButton product={order} weeklyPlan={weeklyPlan} setWeeklyPlan={setWeeklyPlan} daysOfWeek={daysOfWeek} />

                                        <button
                                            onClick={() => removeProduct(order.product)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 my-4">

                            <div>
                                <p className="">Extra Charge</p>
                                <input
                                    type="text"
                                    name="extraCharges"
                                    className="border rounded w-20 p-1 mr-2"
                                    placeholder="Add extra"
                                    onChange={(e: any) => setMembershipsDetails((prev: any) => ({ ...prev, extraCharge: e.target.value }))}
                                    value={membershipDetails?.extraCharge || ""}
                                    required
                                />
                            </div>
                            {
                                (membershipDetails.orders.length != 0) &&
                                <div>
                                    <p className="">Discount Percent(%)</p>
                                    <input
                                        type="number"
                                        name="extraCharges"
                                        className="border rounded w-20 p-1 mr-2"
                                        placeholder="Add extra"
                                        onChange={(e: any) => setMembershipsDetails((prev: any) => ({ ...prev, orders: [{ ...prev.orders[0], discountPercent: e.target.value }] }))}
                                        value={membershipDetails?.orders[0]?.discountPercent || ""}
                                        required
                                    />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center gap-4">
                            <div>
                                <label className="block text-gray-600 mb-2">Time:</label>
                                {membershipDetails.orders.length != 0 &&
                                    <select
                                        name="time"
                                        onChange={(e) => setMembershipsDetails((prev: any) => ({ ...prev, time: e.target.value }))}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                                    >
                                        <option value="0">Select</option>
                                        {
                                            membershipDetails.orders[0]?.timings?.map((t: any, i: number) => <option key={i} value={t}>{formatTime(t)}</option>)
                                        }
                                    </select>
                                }
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-2">Start Date:</label>
                                <input type="date" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                                    onChange={(e) => setMembershipsDetails((prev: any) => ({ ...prev, date: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="mb-4 mt-6">
                        <label className="block text-gray-600 mb-2 text-sm">Payment Method:</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod("UPI")}
                                className={`flex-1 border rounded-full px-2 py-1 text-xs sm:text-sm cursor-pointer transition-colors ${paymentMethod === "UPI" ? "border-green-600 bg-green-50 font-semibold" : "border-gray-300 bg-white"}`}
                            >
                                UPI / Prepaid
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod("COD")}
                                className={`flex-1 border rounded-full px-2 py-1 text-xs sm:text-sm cursor-pointer transition-colors ${paymentMethod === "COD" ? "border-green-600 bg-green-50 font-semibold" : "border-gray-300 bg-white"}`}
                            >
                                Cash on Delivery
                            </button>
                        </div>
                    </div>

                    {/* Membership Total Summary */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-lg mb-3">Membership Total</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Original Price:</span>
                                <span>₹{priceDetails.price.toFixed(2)}</span>
                            </div>
                            {membershipDetails.orders[0]?.discountPercent > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span>Discount ({membershipDetails.orders[0]?.discountPercent}%):</span>
                                    <span>-₹{(priceDetails.price - priceDetails.finalPrice).toFixed(2)}</span>
                                </div>
                            )}
                            {membershipDetails.extraCharge > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span>Extra Charge:</span>
                                    <span>₹{parseInt('0' + membershipDetails.extraCharge).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-semibold text-base border-t pt-2">
                                <span>Total:</span>
                                <span>₹{(priceDetails.finalPrice + parseInt('0' + membershipDetails.extraCharge)).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-6">
                        <p className="text-gray-600 mb-2">Paid / Cash : </p>
                        <div>
                            <input type="checkbox" className="h-6 w-6" checked={membershipDetails?.isPaid || false} onChange={() => setMembershipsDetails((prev: any) => ({ ...prev, isPaid: !prev.isPaid }))} />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-gray-600 mb-2">Message:</label>

                        <input type="text" onChange={(e: any) => setMembershipsDetails((prev: any) => ({ ...prev, message: e.target.value }))}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300" />
                    </div>


                    <button
                        onClick={handleNewMembership}
                        className="w-full bg-green-600 text-white py-2 mt-6 rounded-md hover:bg-green-700"
                    >
                        create Membership
                    </button>

                </div>}
        </div>
    );
}