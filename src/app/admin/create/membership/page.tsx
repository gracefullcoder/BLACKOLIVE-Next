"use client";
import React, { useState } from "react";
import { UserData } from "@/src/types/user";
import ShowProducts from "@/src/components/adminorders/create/ShowProducts";
import AdminOrder from "@/src/components/adminorders/create/AdminOrder";
import { toast } from "react-toastify";
import { createMembership } from "@/src/actions/Order";


export default function Page() {

    const [user, setUser] = useState<UserData | null>(null);
    const [memberships, setMemberships] = useState([])
    const [membershipDetails, setMembershipsDetails] = useState<any>({
        user: "",
        orders: [],
        address: null,
        contact: null,
        time: null,
        date: null,
        isPaid: false,
        extraCharge: "",
        message: ""
    })

    const handleNewMembership = async () => {
        if (membershipDetails.address === null) {
            toast.error("Please select an address for the order.");
            return;
        }

        if (membershipDetails.orders.length == 0) {
            toast.error("Please select a Membership.");
            return;
        }
        console.log(membershipDetails.time)
        if (!parseInt(membershipDetails.time)) {
            toast.error("Please select any Time for the order.");
            return;
        }

        if (!membershipDetails.date) {
            toast.error("Please select startDate.");
            return;
        }

        const response = await createMembership(user?._id || "", membershipDetails.orders[0].product, membershipDetails.address, membershipDetails.contact, membershipDetails.time, membershipDetails.date, membershipDetails.message, parseInt('0' + membershipDetails.extraCharge), membershipDetails.isPaid)

        if (response.success) {
            toast.success(response.message);
        }
    };

    const removeProduct = (pId: any) => {
        setMembershipsDetails((prev: any) => ({ ...prev, orders: prev.orders.filter((order: any) => order.product != pId) }))
    }

    return (
        <div className="container mx-auto p-6 space-y-6">

            <AdminOrder user={user} setUser={setUser} orderDetails={membershipDetails} setOrderDetails={setMembershipsDetails} />


            {user?.email &&
                <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
                    <h3 className="font-semibold text-lg mb-4 text-gray-700">Membership Summary</h3>


                    <ShowProducts products={memberships} setProducts={setMemberships} setOrderDetails={setMembershipsDetails} isMembership={true} />

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

                        <div className="flex items-center gap-2 my-4">

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
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center gap-4">
                            <div>
                                <label className="block text-gray-600 mb-2">Time:</label>
                                <select
                                    name="time"
                                    onChange={(e) => setMembershipsDetails((prev: any) => ({ ...prev, time: e.target.value }))}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                                >
                                    <option value="0">Select</option>
                                    <option value="09:00">09 AM</option>
                                    <option value="12:00">12 PM</option>
                                    <option value="15:00">03 PM</option>
                                    <option value="18:00">06 PM</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-2">Start Date:</label>
                                <input type="date" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                                    onChange={(e) => setMembershipsDetails((prev: any) => ({ ...prev, date: e.target.value }))} />
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