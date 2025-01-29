"use client";

import React, { useState } from "react";
import { uploadFile } from "@/src/utility/ImageKit";
import { Loader2 } from "lucide-react";
import { updateFeature, addTimingServer } from "@/src/actions/Features";
import TopBarMessages from "@/src/components/features/TopBarMessages";

function Page() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<any>("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleImageChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageData: { fileId: string; url: string } = { fileId: "", url: "" };

            if (imageFile) {
                imageData = await uploadFile(imageFile);
            }

            const response: any = updateFeature(imageData.url, imageData.fileId);

            if (response.success) {
                setMessage({ text: "Product created successfully!", type: "success" });
                setImageFile(null);
                setImagePreview("");
            }
        } catch (error) {
            console.log(error);
            setMessage({ text: "Failed to create product", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleAddTiming = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const result = await addTimingServer(formData);
        console.log(result.message);
    };

    return (
        <div className="p-6 space-y-10">
            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
                {message.text && (
                    <div
                        className={`mb-4 p-3 rounded ${message.type === "success"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                    >
                        {message.text}
                    </div>
                )}
                <h1 className="text-2xl font-bold text-center">Update Hero Image</h1>
                <div className="space-y-4">
                    <input
                        type="file"
                        name="heroImage"
                        onChange={handleImageChange}
                        className="block w-full px-4 py-2 text-sm border rounded-md"
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-20 w-20 object-cover rounded"
                        />
                    )}
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center py-2 px-4 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                        }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                            Creating...
                        </>
                    ) : (
                        "Update Hero Image"
                    )}
                </button>
            </form>

            <form
                onSubmit={handleAddTiming}
                method="post"
                className="w-full max-w-md mx-auto space-y-4"
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

            <div className="flex justify-center">
                <TopBarMessages />

            </div>
        </div>
    );
}

export default Page;
