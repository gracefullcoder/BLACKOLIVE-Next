"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { UserData } from "@/src/types/user";
import { addExtraCharge, createOrder } from "@/src/actions/Order";
import AdminOrder from "@/src/components/adminorders/create/AdminOrder";
import ShowProducts from "@/src/components/adminorders/create/ShowProducts";
import { Minus, Plus } from "lucide-react";
import { PreviewData } from "next";



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
        message: ""
    })

    console.log(orderDetails)

    const handleOrderSubmit = async () => {
        if (orderDetails.address === null) {
            toast.error("Please select an address for the order.");
            return;
        }

        if (!parseInt(orderDetails.time)) {
            toast.error("Please select any Time for the order.");
            return;
        }
        // Handle order submission logic here
        const response = await createOrder(user?._id || "", orderDetails.orders, orderDetails.address, orderDetails.contact, orderDetails.time, orderDetails.message, orderDetails.isPaid)

        if (response.success) {
            toast.success(response.message);
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

    return (
        <div className="container mx-auto p-6 space-y-6">

            <AdminOrder user={user} setUser={setUser} orderDetails={orderDetails} setOrderDetails={setOrderDetails} />

            {user && (
                <div className="bg-white p-6 rounded-lg shadow-lg">

                    <h3 className="font-semibold text-lg mb-4 text-gray-700">Order Summary</h3>

                    {user.email && <ShowProducts products={products} setProducts={setProducts} setOrderDetails={setOrderDetails} isMembership={false} />}

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
                                            onChange={(e: any) => setOrderDetails((prev: any) => ({ ...prev, orders: prev.orders.map((item: any) => (item.product == order.product ? { ...item, extraCharge: parseInt(e.target.value) } : item)) }))}
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
                            <option value="9">09 AM</option>
                            <option value="12">12 PM</option>
                            <option value="15">03 PM</option>
                            <option value="18">06 PM</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 mt-6">
                        <p className="text-gray-600 mb-2">Paid / Cash : </p>
                        <div>
                            <input type="checkbox" className="h-6 w-6" checked={orderDetails?.isPaid || false} onChange={() => setOrderDetails((prev: any) => ({ ...prev, isPaid: !prev.isPaid }))} />
                        </div>
                    </div>


                    <div className="mt-6">
                        <label className="block text-gray-600 mb-2">Message:</label>

                        <input type="text" onChange={(e: any) => setOrderDetails((prev: any) => ({ ...prev, message: e.target.value }))}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300" />
                    </div>

                    <button
                        onClick={handleOrderSubmit}
                        className="w-full bg-green-600 text-white py-2 mt-6 rounded-md hover:bg-green-700"
                    >
                        create Order
                    </button>
                </div>

            )}
        </div>
    );
}
