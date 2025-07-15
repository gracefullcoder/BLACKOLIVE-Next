"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { UserData } from "@/src/types/user";
import { createOrder } from "@/src/actions/Order";
import AdminOrder from "@/src/components/adminorders/create/AdminOrder";
import ShowProducts from "@/src/components/adminorders/create/ShowProducts";
import { Minus, Plus } from "lucide-react";
import { featureDetails } from "@/src/actions/Features";
import { displayRazorpay } from "@/src/lib/razorpay";

export default function Page() {

    const [user, setUser] = useState<UserData | null>(null);
    const [products, setProducts] = useState([])
    const [orderDetails, setOrderDetails] = useState<any>({
        user: "",
        orders: [],
        address: null,
        contact: null,
        time: null,
        isPaid: false,
        deliveryCharge: 0,
        message: "",
        adminOrder: {
            customerName: ""
        }
    })
    const [pincodes, setPincodes] = useState<any[]>([]);
    const [paymentMethod, setPaymentMethod] = useState("COD");

    useEffect(() => {
        const fetchPincodes = async () => {
            const features = await featureDetails();
            setPincodes(features.pincodes || []);
        };
        fetchPincodes();
    }, []);

    const getPincode = () => {
        if (user && orderDetails.address !== null && user.addresses && user.addresses.length > 0) {
            const selectedAddr = user.addresses[orderDetails.address];
            if (selectedAddr && selectedAddr.pincode) {
                const found = pincodes.find((pin: any) => pin.pincode == selectedAddr.pincode);
                return found ? found : null;
            }
        }

        return null;
    }

    useEffect(() => {
        let pincodeData: any = getPincode();
        if (pincodeData != null) {
            setOrderDetails((prev: any) => ({
                ...prev,
                deliveryCharge: pincodeData?.deliveryCharge || 0
            }));
        }
    }, [orderDetails.address]);

    console.log(orderDetails)

    const handleOrderSubmit = async () => {

        if (orderDetails.address === null) {
            toast.error("Please select an address for the order.");
            return;
        }

        let apple = getPincode();
        console.log("kela", apple)
        if (getPincode() == null) {
            toast.error("Not Deliverable in that area please add first");
            return;
        }

        if (!parseInt(orderDetails.time)) {
            toast.error("Please select any Time for the order.");
            return;
        }



        const subtotal = orderDetails.orders.reduce((sum: number, order: any) => {
            return sum + (order.priceCharged * order.quantity) + (order.extraCharge || 0);
        }, 0);
        const totalAmount = subtotal + (orderDetails.deliveryCharge || 0);

        const orderData = {
            userId: user?._id || "",
            orderItems: orderDetails.orders,
            addressId: orderDetails.address,
            contact: orderDetails.contact,
            time: orderDetails.time,
            message: orderDetails.message,
            isPaid: paymentMethod === "UPI" || orderDetails.isPaid,
            totalAmount: totalAmount,
            deliveryCharge: orderDetails.deliveryCharge?.toString() || "0",
            adminOrder: orderDetails.adminOrder
        };

        const additionalDetails = {
            userDetails: user,
            productDetails: {
                title: "Black Olive",
                description: "Order Fresh Salads",
                image: "https://ik.imagekit.io/vaibhav11/BLACKOLIVE/tr:w-40,h-40/newlogo.png?updatedAt=1750700640825",
            }
        };

        if (paymentMethod === "UPI") {
            displayRazorpay({
                orderDetails: orderData,
                totalAmount,
                additionalDetails,
                updateFnx: async (orderDetailsWithPayment: any, mailData: any, paymentData: any) => {
                    // Call createOrder with paymentData
                    const response = await createOrder(orderDetailsWithPayment, paymentData);
                    if (response.success) {
                        toast.success(response.message);
                        setOrderDetails({
                            user: "",
                            orders: [],
                            address: null,
                            contact: null,
                            time: null,
                            isPaid: false,
                            deliveryCharge: 0,
                            message: "",
                            adminOrder: {
                                customerName: ""
                            }
                        });
                        setUser(null);
                    } else {
                        toast.error(response.message || "Failed to create order");
                    }
                    return response;
                }
            });
        } else {
            const response = await createOrder(orderData);
            if (response.success) {
                toast.success(response.message);
                setOrderDetails({
                    user: "",
                    orders: [],
                    address: null,
                    contact: null,
                    time: null,
                    isPaid: false,
                    deliveryCharge: 0,
                    message: "",
                    adminOrder: {
                        customerName: ""
                    }
                });
                setUser(null);
            } else {
                toast.error(response.message || "Failed to create order");
            }
        }
    };

    const removeProduct = (pId: any) => {
        setOrderDetails((prev: any) => ({ ...prev, orders: prev.orders.filter((order: any) => order.product != pId) }))
    }

    const handleQuantity = (pId: any, quantity: any) => {
        setOrderDetails((prev: any) => {
            const newOrders = prev.orders.map((order: any) => {
                if (order.product == pId) {
                    return { ...order, quantity: Math.max(1, quantity) }
                }
                return order;
            })

            return { ...prev, orders: newOrders }
        })
    }

    // Calculate totals
    const subtotal = orderDetails.orders.reduce((sum: number, order: any) => {
        return sum + (order.priceCharged * order.quantity) + (order.extraCharge || 0);
    }, 0);
    const totalAmount = subtotal + (orderDetails.deliveryCharge || 0);

    return (
        <div className="container mx-auto p-6 space-y-6">

            <AdminOrder user={user} setUser={setUser} orderDetails={orderDetails} setOrderDetails={setOrderDetails} />

            {user && (
                <div className="bg-white p-6 rounded-lg shadow-lg">

                    <h3 className="font-semibold text-lg mb-4 text-gray-700">Order Summary</h3>

                    {user.email && <ShowProducts orderDetails={orderDetails} products={products} setProducts={setProducts} setOrderDetails={setOrderDetails} isMembership={false} />}

                    <div className="mt-6">
                        <h3 className="font-semibold text-lg mb-4">Orders</h3>
                        <div className="space-y-4">
                            {orderDetails.orders.map((order: any, idx: any) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md"
                                >

                                    <div className="font-medium text-gray-800">
                                        Product: {order.title}
                                    </div>

                                    <div className="flex gap-2 items-center">
                                        <div className="mr-1 border border-black rounded-md p-1 cursor-pointer" onClick={() => handleQuantity(order.product, order.quantity - 1)}><Minus /></div>
                                        <div>
                                            <div className="px-4 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                                {order.quantity}
                                            </div>
                                        </div>
                                        <div className="border border-black rounded-md p-1 cursor-pointer" onClick={() => handleQuantity(order.product, order.quantity + 1)}><Plus /></div>
                                    </div>

                                    <div className="flex items-center justify-between">

                                        <input
                                            type="number"
                                            name="extraCharges"
                                            className="border rounded w-20 p-1 mr-2"
                                            placeholder="Add extra"
                                            onChange={(e: any) => setOrderDetails((prev: any) => ({ ...prev, orders: prev.orders.map((item: any) => (item.product == order.product ? { ...item, extraCharge: parseInt(e.target.value) || 0 } : item)) }))}
                                            value={order?.extraCharge || 0}
                                            required
                                        />
                                    </div>

                                    <button
                                        onClick={() => removeProduct(order.product)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-gray-600 mb-2">Time:</label>
                        <select
                            name="time"
                            onChange={(e) => setOrderDetails((prev: any) => ({ ...prev, time: e.target.value }))}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                        >
                            <option value="0">Select</option>
                            <option value="09:00">09 AM</option>
                            <option value="12:00">12 PM</option>
                            <option value="15:00">03 PM</option>
                            <option value="18:00">06 PM</option>
                        </select>
                    </div>

                    {/* Delivery Charge Input */}
                    <div className="mt-6">
                        <label className="block text-gray-600 mb-2">Delivery Charge:</label>
                        <input
                            type="number"
                            value={orderDetails.deliveryCharge || 0}
                            onChange={(e: any) => setOrderDetails((prev: any) => ({ ...prev, deliveryCharge: parseInt(e.target.value) }))}
                            className="w-full px-4 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring focus:ring-green-300"
                            placeholder="Auto-calculated by pincode"
                        />
                    </div>

                    <div className="flex items-center gap-2 mt-6">
                        <p className="text-gray-600 mb-2">Paid / Cash : </p>
                        <div>
                            <input type="checkbox" className="h-6 w-6" checked={orderDetails?.isPaid || false} onChange={() => setOrderDetails((prev: any) => ({ ...prev, isPaid: !prev.isPaid }))} />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-gray-600 mb-2">Message:</label>
                        <input
                            type="text"
                            onChange={(e: any) => setOrderDetails((prev: any) => ({ ...prev, message: e.target.value }))}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                        />
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

                    {/* Order Total Summary */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-lg mb-3">Order Total</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal:</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            {orderDetails.deliveryCharge > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span>Delivery Charge:</span>
                                    <span>₹{orderDetails.deliveryCharge.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-semibold text-base border-t pt-2">
                                <span>Total:</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleOrderSubmit}
                        className="w-full bg-green-600 text-white py-2 mt-6 rounded-md hover:bg-green-700"
                    >
                        Create Order
                    </button>
                </div>

            )}
        </div>
    );
}
