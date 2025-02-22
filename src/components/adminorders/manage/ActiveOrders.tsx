"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { getFilteredOrders } from "@/src/actions/Order";
import OrderGrid from "@/src/components/adminorders/manage/OrderGrid";
import { useSession } from "next-auth/react";
import { deliveryUsers } from "@/src/actions/User";
import PreLoader from "../../PreLoader";
import { Check, Route } from "lucide-react";
import { openInGoogleMaps, openRouteInMaps } from "@/src/utility/basic";

function ActiveOrders({ onlyAssigned }: any) {
    const session = useSession();

    const [orders, setOrders] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState("all");
    const [orderItems, setOrderItems] = useState(new Map());
    const [isActive, setIsActive] = useState(false);
    const [prevRead,setPrevRead] = useState(0);
    const pendingOrders = useMemo(() => orders.reduce((acc: any, order: any) => (order.status == "pending" ? acc += 1 : acc), 0), [orders])

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const res = await deliveryUsers();
            console.log(res);
            if (res.success) {
                setUsers(res?.users);
            }
        }

        getUsers();
    }, [])

    useEffect(() => {
        fetchFilteredOrders();
    }, [timeFilter, session.data, isActive]);

    useEffect(() => {
        const interval = setInterval(fetchFilteredOrders, 60000);

        return () => clearInterval(interval)
    }, []);

    const mapProducts = (data: any) => {
        const productMapping = new Map();

        data.forEach((orderDet: any) => {
            orderDet.orders.forEach((order: any) => {
                let productId = order.product._id;
                if (productMapping.has(productId)) {
                    const prodDet = productMapping.get(productId);
                    productMapping.set(productId, {
                        ...prodDet,
                        quantity: prodDet.quantity + order.quantity,
                    });
                } else {
                    productMapping.set(productId, {
                        quantity: order.quantity,
                        name: order.product.title,
                    });
                }
            });
        });

        setOrderItems(productMapping);
    };

    const fetchFilteredOrders = async () => {
        try {
            setLoading(true);
            console.log("Here we go again")
            const status = ["delivered", "cancelled"];
            const time = timeFilter === "all" ? null : timeFilter;
            const data = await getFilteredOrders(time, status, true);
            if (onlyAssigned || isActive) {
                const myOrders = data.filter((order: any) => order?.assignedTo?._id == session.data?.user?._id)
                console.log("in", myOrders)
                mapProducts(myOrders);
                setOrders(myOrders);
            } else {
                console.log(data)
                mapProducts(data);
                setOrders(data);
            }
        } catch (err) {
            console.error("Failed to fetch filtered orders", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) <PreLoader />


    return (
        <div className="p-4 max-w-7xl mx-auto">

            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Order Management</h1>

                {/* Filters */}
                <div className="flex flex-col lg:flex-row items-center gap-6 mb-4 justify-between">

                    <div className="flex gap-4">

                        <div className="flex gap-4 w-full lg:w-auto">
                            <select
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                                className="border p-3 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            >
                                <option value="all">All Times</option>
                                <option value="morning">Slot-1 (6AM-11AM)</option>
                                <option value="afternoon">Slot-2 (11AM-2PM)</option>
                                <option value="evening">Slot-3 (2PM-5PM)</option>
                                <option value="night">Slot-4 (5PM-12AM)</option>
                            </select>
                        </div>

                        {!onlyAssigned && (
                            <div className="flex items-center gap-3 border p-3 rounded-lg bg-white shadow-md">
                                <input
                                    type="checkbox"
                                    id="assigned"
                                    checked={isActive}
                                    onChange={() => setIsActive((prev) => !prev)}
                                    className="h-5 w-5 accent-blue-500 cursor-pointer"
                                />
                                <label htmlFor="assigned" className="text-gray-700 font-medium">
                                    Assigned to me
                                </label>
                            </div>
                        )}

                        {(onlyAssigned || isActive) && (
                            <button
                                className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
                                onClick={() => openRouteInMaps(orders)}
                            >
                                <Route size={20} /> Open Route
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row bg-gray-50 p-6 rounded-xl shadow-md border w-full lg:w-auto gap-6">

                        <div className="flex flex-col items-center">
                            <p className="text-gray-700 font-medium">Active Orders</p>
                            <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <p className="text-gray-700 font-medium">Pending Orders</p>
                            <p className="text-3xl font-bold text-red-500">{pendingOrders}</p>
                        </div>

                        <div className="flex gap-6 justify-center">
                            <div className="flex flex-col items-center">
                                <p className="text-gray-700 font-medium">Unread Orders</p>
                                <p className="text-3xl font-bold text-orange-500">{pendingOrders - prevRead}</p>
                            </div>
                            <div className="mt-auto pb-2">
                                <button
                                    className="mt-3 p-2 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition-all flex items-center justify-center"
                                    onClick={() => (setPrevRead(pendingOrders))}
                                    title="Mark as Read"
                                >
                                    <Check size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>



                <OrderGrid
                    title={""}
                    orders={orders}
                    setOrders={setOrders}
                    setError={() => { }}
                    session={session}
                    isMembership={false}
                    users={users}
                />

            </div>

            {/* Messaged Orders */}
            <div className="my-6 overflow-x-auto">
                <h2 className="text-lg font-semibold mb-2">Messaged Orders</h2>
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border-2 border-black px-4 py-2">Order Details</th>
                            <th className="border-2 border-black px-4 py-2">Product Name</th>
                            <th className="border-2 border-black px-4 py-2">Quantity</th>
                            <th className="border-2 border-black px-4 py-2">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders
                            .filter((order: any) => order.message)
                            .map((orderDet: any) =>
                                orderDet.orders.map((item: any, idx: any) => (
                                    <tr key={`${orderDet._id}-${idx}`}>
                                        {idx === 0 && (<td className='border-2 border-black border-r-gray-300 px-4 py-2' rowSpan={orderDet.orders.length}>
                                            <p>Id: {orderDet._id}</p>
                                            <p>Name: {orderDet.user.name}</p>
                                            <p><span>Address:</span> {orderDet.address.address}, {orderDet.address.landmark}, {orderDet.address.pincode}</p>
                                            <p>
                                                <span className="font-bold">{orderDet?.assignedTo?._id == session.data?.user?._id ? "Assigned To Me " : "Assigned To"}</span>
                                                {orderDet.assignedTo ? <span className="font-bold text-green-500"> {orderDet?.assignedTo?.name}</span> : <span className="font-bold text-red-500">None</span>}
                                            </p>

                                        </td>)}
                                        <td className={` border border-gray-300 ${idx == orderDet.orders.length - 1 && 'border-2 border-b-black'} px-4 py-2`}>
                                            <p>{item.product.title}</p>
                                        </td>
                                        <td className={` border border-gray-300 ${idx == orderDet.orders.length - 1 && 'border-2 border-b-black'} px-4 py-2`}>
                                            <p>{item.quantity}</p>
                                        </td>
                                        {idx === 0 && (
                                            <td className="border-2 border-black border-l-gray-300 px-4 py-2" rowSpan={orderDet.orders.length}>
                                                <p className="text-sm text-green-500 font-bold text-right">{orderDet.assignedTo == session.data?.user?._id && <>Assigned <span className="text-black">{orderDet._id.slice(-6)}</span></>}</p>
                                                <p className="text-red-500">{orderDet.message}</p>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                    </tbody>
                </table>

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
            </div>
        </div>
    )
}

export default ActiveOrders