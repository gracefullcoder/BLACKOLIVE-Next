"use client"
import { handleInputChange } from "@/src/utility/basic";
import React, { useState, useEffect } from "react";

const ManagePincodes = () => {
    const [pincodes, setPincodes] = useState([]);
    const [newPincode, setNewPincode] = useState({ pincode: "", deliveryCharge: 0 });
    const [editingIndex, setEditingIndex] = useState<any>(null);
    const [updatedPincode, setUpdatedPincode] = useState({ pincode: "", deliveryCharge: 0 });


    useEffect(() => {
        fetch("/api/admin/features/pincode", { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    console.log(data);
                    setPincodes(data.pincodes);
                }
            });
    }, []);

    const addPincode = async () => {
        if (!newPincode.pincode.toString().trim()) return;

        const res = await fetch("/api/admin/features/pincode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPincode),
        });
        const data = await res.json();

        if (data.success) {
            setPincodes(data.pincodes);
            setNewPincode({ pincode: "", deliveryCharge: 0 });
        }
    };

    const updatePincode = async () => {
        if (!updatedPincode?.pincode?.toString().trim()) return;

        const res = await fetch("/api/admin/features/pincode", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ index: editingIndex, newPincode: updatedPincode }),
        });
        const data = await res.json();

        if (data.success) {
            setPincodes(data.pincodes);
            setEditingIndex(null);
            setUpdatedPincode({ pincode: "", deliveryCharge: 0 });
        }
    };


    const deletePincode = async (index: any) => {
        const res = await fetch("/api/admin/features/pincode", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ index }),
        });
        const data = await res.json();

        if (data.success) {
            setPincodes(data.pincodes);
        }
    };

    return (
        <div className="p-4 w-fit mx-auto">
            <h2 className="text-2xl font-bold mb-4">Manage Pincodes</h2>

            <div className="my-4 flex flex-wrap gap-2">
                <input
                    type="text"
                    value={newPincode.pincode}
                    name="pincode"
                    onChange={(e) => handleInputChange(e, setNewPincode)}
                    placeholder="Enter new pincode"
                    className="border p-2 flex-grow rounded-md"
                />
                <input
                    type="number"
                    value={newPincode.deliveryCharge}
                    name="deliveryCharge"
                    onChange={(e) => handleInputChange(e, setNewPincode)}
                    placeholder="Enter Delivery Charge"
                    className="border p-2 flex-grow rounded-md"
                />
                <button
                    onClick={addPincode}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md"
                >
                    Add
                </button>
            </div>

            <ul className="space-y-2">
                {pincodes.map((pincode: any, index: number) => (
                    <li key={pincode._id || index} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 border rounded-md shadow-sm space-y-2 sm:space-y-0">
                        {editingIndex === index ? (
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={updatedPincode.pincode}
                                    onChange={(e) =>
                                        setUpdatedPincode((prev) => ({ ...prev, pincode: e.target.value }))
                                    }
                                    className="border p-1 rounded-md"
                                    placeholder="Pincode"
                                />
                                <input
                                    type="number"
                                    value={updatedPincode.deliveryCharge}
                                    onChange={(e) =>
                                        setUpdatedPincode((prev) => ({ ...prev, deliveryCharge: Number(e.target.value) }))
                                    }
                                    className="border p-1 rounded-md"
                                    placeholder="Delivery Charge"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <span>{pincode.pincode}</span>
                                <span>₹{pincode.deliveryCharge}</span>
                            </div>
                        )}


                        <div className="flex space-x-2">
                            {editingIndex === index ? (
                                <button
                                    onClick={updatePincode}
                                    className="px-2 py-1 bg-green-500 text-white rounded-md"
                                >
                                    Save
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setEditingIndex(index);
                                        setUpdatedPincode({
                                            pincode: pincode.pincode,
                                            deliveryCharge: pincode.deliveryCharge,
                                        });
                                    }}
                                    className="px-2 py-1 bg-blue-500 text-white rounded-md"
                                >
                                    Edit
                                </button>

                            )}
                            <button
                                onClick={() => deletePincode(pincode._id)}
                                className="px-2 py-1 bg-red-500 text-white rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}

            </ul>

        </div>
    );
};

export default ManagePincodes;
