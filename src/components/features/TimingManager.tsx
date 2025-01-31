// components/TimingManager.tsx
"use client";

import React, { useState, useEffect } from "react";
import { addTimingServer, fetchTimingsServer, deleteTimingServer } from "@/src/actions/Features";

const TimingManager = () => {
    const [timings, setTimings] = useState([]);
    const [loading, setLoading] = useState(false);



    const handleAddTiming = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const result = await addTimingServer(formData);
        if (result.success) {
            // fetchTimings();
            alert(result.message);
        } else {
            alert("Failed to add timing");
        }
    };

    const handleDeleteTiming = async (timingId: string) => {
        const result = await deleteTimingServer(timingId);
        if (result.success) {
            // fetchTimings();
            alert(result.message);
        } else {
            alert("Failed to delete timing");
        }
    };

    useEffect(() => {
        const fetchTimings = async () => {
            setLoading(true);
            const data = await fetchTimingsServer();
            setTimings(data);
            setLoading(false);
        };

        fetchTimings();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Manage Delivery Timings</h1>

            <form
                onSubmit={handleAddTiming}
                className="w-full max-w-md mx-auto space-y-4 mb-6"
            >
                <h2 className="text-xl font-semibold text-center">Add Timing</h2>
                <input
                    className="block w-full border p-2 rounded-md"
                    type="time"
                    name="startTime"
                    required
                />
                <input
                    className="block w-full border p-2 rounded-md"
                    type="time"
                    name="endTime"
                    required
                />
                <input
                    className="block w-full border p-2 rounded-md"
                    type="time"
                    name="deliveryTime"
                    required
                />
                <input
                    className="block w-full border p-2 rounded-md"
                    type="text"
                    name="display"
                    placeholder="Enter display text"
                    required
                />
                <button
                    type="submit"
                    className="w-full py-2 px-4 text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Add Timing
                </button>
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul className="space-y-4">
                    {timings.map((timing: any, idx: any) => (
                        <li
                            key={timing?._id}
                            className="flex justify-between items-center border p-4 rounded-md"
                        >
                            <div>
                                <p>
                                    <strong>Start:</strong> {timing.startTime}
                                </p>
                                <p>
                                    <strong>End:</strong> {timing.endTime}
                                </p>
                                <p>
                                    <strong>Delivery:</strong> {timing.deliveryTime}
                                </p>
                                <p>
                                    <strong>Display:</strong> {timing.display}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDeleteTiming(timing._id)}
                                className="text-red-600 hover:underline"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TimingManager;
