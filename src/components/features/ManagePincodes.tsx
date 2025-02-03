"use client"
import React, { useState, useEffect } from "react";

const ManagePincodes = () => {
    const [pincodes, setPincodes] = useState([]);
    const [newPincode, setNewPincode] = useState("");
    const [editingIndex, setEditingIndex] = useState<any>(null);
    const [updatedPincode, setUpdatedPincode] = useState("");

    useEffect(() => {
        fetch("/api/admin/features/pincode", { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setPincodes(data.pincodes);
                }
            });
    }, []);

    const addPincode = async () => {
        if (!newPincode.trim()) return;

        const res = await fetch("/api/admin/features/pincode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pincode: newPincode }),
        });
        const data = await res.json();

        if (data.success) {
            setPincodes(data.pincodes);
            setNewPincode("");
        }
    };

    const updatePincode = async (index: any) => {
        if (!updatedPincode.trim()) return;

        const res = await fetch("/api/admin/features/pincode", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ index, newPincode: updatedPincode }),
        });
        const data = await res.json();

        if (data.success) {
            setPincodes(data.pincodes);
            setEditingIndex(null);
            setUpdatedPincode("");
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
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Manage Pincodes</h2>

            <div className="mt-4 flex space-x-2">
                <input
                    type="text"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    placeholder="Enter new pincode"
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
                {pincodes.map((pincode, index) => (
                    <li key={index} className="flex items-center justify-between p-2 border rounded-md shadow-sm">
                        {editingIndex === index ? (
                            <input
                                type="text"
                                value={updatedPincode}
                                onChange={(e) => setUpdatedPincode(e.target.value)}
                                className="border p-1 rounded-md"
                            />
                        ) : (
                            <span>{pincode}</span>
                        )}

                        <div className="space-x-2">
                            {editingIndex === index ? (
                                <button
                                    onClick={() => updatePincode(index)}
                                    className="px-2 py-1 bg-green-500 text-white rounded-md"
                                >
                                    Save
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setEditingIndex(index);
                                        setUpdatedPincode(pincode);
                                    }}
                                    className="px-2 py-1 bg-blue-500 text-white rounded-md"
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                onClick={() => deletePincode(index)}
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
