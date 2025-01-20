"use client";
import React, { useState, useEffect } from "react";
import { getFilteredMemberships } from "@/src/actions/Order";
import OrderGrid from "@/src/components/adminorders/manage/OrderGrid";
import { useSession } from "next-auth/react";

export default function OrdersPage() {
    const session = useSession();

    const [orders, setOrders] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState("all");
    const [orderItems, setOrderItems] = useState(new Map());
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        fetchFilteredOrders();
    }, [timeFilter, session.data, isActive]);

    const mapProducts = (data: any) => {
        const productMapping = new Map();

        data.forEach((orderDet: any) => {

            let productId = orderDet.category._id;
            if (productMapping.has(productId)) {
                const prodDet = productMapping.get(productId);
                productMapping.set(productId, {
                    ...prodDet,
                    quantity: prodDet.quantity + 1,
                });
            } else {
                productMapping.set(productId, {
                    quantity: 1,
                    name: orderDet.category.title
                });
            }

        });

        setOrderItems(productMapping);
    };

    const fetchFilteredOrders = async () => {
        try {
            setLoading(true);
            const status = "delivered";
            const time = timeFilter === "all" ? null : timeFilter;
            const data = await getFilteredMemberships(time, status, true, true, true);
            console.log("in", data)
            if (isActive) {
                const myMemberships = data.filter((order: any) => order.assignedTo == session.data?.user?._id)
                mapProducts(myMemberships);
                setOrders(myMemberships);
            } else {
                mapProducts(data);
                setOrders(data);
            }
        } catch (err) {
            console.error("Failed to fetch filtered orders", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                Loading...
            </div>
        );

    return (
        <div className="p-4 max-w-7xl mx-auto">

            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Order Management</h1>

                {/* Filters */}
                <div className="flex gap-4">
                    <div className="flex gap-4 mb-6">
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="border p-2 rounded"
                        >
                            <option value="all">All Times</option>
                            <option value="morning">Slot-1 (6AM-11AM)</option>
                            <option value="afternoon">Slot-2 (11AM-2PM)</option>
                            <option value="evening">Slot-3 (2PM-5PM)</option>
                            <option value="night">Slot-4 (5PM-12AM)</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 mb-6 border p-4 rounded">
                        <input
                            type="checkbox"
                            id="assigned"
                            checked={isActive}
                            onChange={() => setIsActive((prev) => !prev)}
                            className="h-4 w-4"
                        />
                        <label htmlFor="assigned">Assigned to me</label>
                    </div>
                </div>

                <OrderGrid
                    title={""}
                    orders={orders}
                    setOrders={setOrders}
                    setError={() => { }}
                    session={session}
                    isMembership={true}
                />

            </div>

            {/* Orders Summary */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Orders Summary</h2>


                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Product Name</th>
                            <th className="border border-gray-300 px-4 py-2">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...orderItems.keys()].map((key) => (
                            <tr key={key}>
                                <td className="border border-gray-300 px-4 py-2">
                                    {orderItems.get(key)?.name}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {orderItems.get(key)?.quantity}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Messaged Orders */}
                <div className="my-6">
                    <h2 className="text-lg font-semibold mb-2">Messaged Orders</h2>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border-2 border-black px-4 py-2">Order Details</th>
                                <th className="border-2 border-black px-4 py-2">Product Name</th>
                                <th className="border-2 border-black px-4 py-2">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.filter((order: any) => order.message).map((orderDet: any, idx: any) =>
                            (<tr key={`${orderDet._id}-${idx}`}>

                                {idx === 0 && (<td className='border border-gray-300 px-4 py-2'>
                                    <p>Id: {orderDet._id}</p>
                                    <p>Name: {orderDet.user.name}</p>
                                    <span>Address:</span> {orderDet.address.address}, {orderDet.address.landmark}, {orderDet.address.pincode}
                                </td>)}
                                <td className="border border-gray-300 px-4 py-2">
                                    <p>{orderDet.category.title}</p>
                                </td>

                                <td className="border border-gray-300 px-4 py-2">
                                    <p className="text-sm text-green-500 font-bold text-right">{orderDet.assignedTo == session.data?.user?._id && <>Assigned <span className="text-black">{orderDet._id.slice(-6)}</span></>}</p>
                                    <p className="text-red-500">{orderDet.message}</p>
                                </td>

                            </tr>)
                            )}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
}
