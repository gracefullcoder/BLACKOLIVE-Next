"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PreLoader from "@/src/components/PreLoader";

function Page() {
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (userId) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`/api/admin/users/${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                        setUserData(data);
                    } else {
                        const err = await response.json();
                        setError(err.error);
                    }
                } catch (err) {
                    setError("Failed to fetch user data.");
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        }
    }, [userId]);

    if (loading) return <PreLoader />;
    if (error) return <div className="text-center text-red-500 text-lg">Error: {error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6">User Details</h1>

            {userData && (
                <>
                    <div className="flex flex-wrap max-sm:justify-center max-sm:text-center items-center gap-6 bg-white p-6 rounded-lg shadow-md mb-8">
                        <img
                            src={userData?.profileImage}
                            alt={`${userData?.name}'s profile`}
                            className="w-24 h-24 rounded-full border border-gray-300"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{userData?.name}</h2>
                            <p className="text-gray-600">Email: {userData?.email}</p>
                            <p className="text-gray-600">Contact: {userData?.contact}</p>
                            <p className="text-gray-600">Admin: {userData?.isAdmin ? "Yes" : "No"}</p>
                            <p className="text-gray-600">Delivery: {userData?.isDelivery ? "Yes" : "No"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Orders</h2>
                            <p className="text-gray-600 mb-4">Total Orders: {userData?.orderDetails?.length}</p>
                            {userData?.orderDetails?.map((order: any) => (
                                <div key={order._id} className="mb-4 border-b pb-4">
                                    <h4 className="font-medium">Order ID: {order._id}</h4>
                                    <p className="text-gray-700">Status: {order.status}</p>
                                    <p className="text-gray-700">Assigned To: {order?.assignedTo?.name || "Not Assigned"}</p>
                                    <p className="text-gray-700">Total Price: ₹{order.orders.reduce((total: number, item: any) => total + (item.product.finalPrice * item.quantity) + (item.extraCharge || 0), 0)}</p>
                                    {order.orders.map((item: any) => (
                                        <div key={item.product._id} className="ml-4 mt-2">
                                            <p className="text-gray-700">Product: {item.product.title}</p>
                                            <p className="text-gray-700">Quantity: {item.quantity}</p>
                                            <p className="text-gray-700">Price: ₹{item.product.finalPrice}</p>
                                            <p className="text-gray-700">Extra Charge: ₹{item.extraCharge || 0}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Membership Details</h2>
                            <p className="text-gray-600 mb-4">Total Memberships: {userData?.membershipDetails?.length}</p>
                            {userData?.membershipDetails?.map((membership: any) => (
                                <div key={membership._id} className="mb-4 border-b pb-4">
                                    <p className="text-gray-700">Category: {membership.category.title}</p>
                                    <p className="text-gray-700">Start Date: {new Date(membership.startDate).toLocaleDateString()}</p>
                                    <p className="text-gray-700">Status: {membership.status}</p>
                                    <p className="text-gray-700">Assigned To: {membership?.assignedTo?.name || "Not Assigned"}</p>
                                    <p className="text-gray-700">Overall Rating: {membership.overallRating}</p>
                                    <p className="text-gray-700">Extra Charge: ₹{membership.extraCharge || 0}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {userData?.cart?.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                            <h2 className="text-2xl font-semibold mb-4">Cart</h2>
                            {userData?.cart?.map((item: any) => (
                                <div key={item.product._id} className="mb-4 border-b pb-4">
                                    <p className="text-gray-700">Product: {item.product.title}</p>
                                    <p className="text-gray-700">Quantity: {item.quantity}</p>
                                    <p className="text-gray-700">Price: ₹{item.product.finalPrice}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Page;