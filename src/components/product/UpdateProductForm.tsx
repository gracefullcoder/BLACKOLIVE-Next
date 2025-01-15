"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { uploadFile } from "@/src/utility/ImageKit";
import axios from "axios";
import { getSpecificProduct } from "@/src/actions/Product";

const UpdateProductForm = ({ productId, isMembership }: { productId: any, isMembership: boolean }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [formData, setFormData] = useState(!isMembership ? {
        title: "",
        details: "",
        image: "",
        fileId: "",
        speciality: "",
        price: "",
        finalPrice: "",
        isAvailable: true,
        responses: []
    } :
        {
            title: "",
            details: "",
            image: "",
            fileId: "",
            speciality: "",
            price: "",
            finalPrice: "",
            isAvailable: true,
            days: 0,
            timings: [],
            bonus: 0,
            responses: []
        }
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<any>('');

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
    const router = useRouter();

    useEffect(() => {
        // Fetch product details
        const fetchProduct = async () => {
            try {
                const response = await getSpecificProduct(productId)
                console.log(response)
                setFormData(response);
                setImagePreview(response.image);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        if (name == "timings") {
            setFormData((prev) => ({ ...prev, [name]: value.split(",") }));
        }
        else setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            let imageData: { fileId: string, url: string } = { fileId: formData.fileId, url: formData.image };

            if (imageFile) {
                imageData = await uploadFile(imageFile);
            }

            console.log(imageData)

            await axios.patch(`/api/admin/products`, {
                ...formData,
                image: imageData.url,
                id: productId,
                isMembership
            });

            setMessage({ text: "Product updated successfully!", type: "success" });
            router.push("/admin/products");
        } catch (error) {
            console.error("Error updating product:", error);
            setMessage({ text: "Failed to update product", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Update Product</h2>
                    {message.text && (
                        <div
                            className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}
                        >
                            {message.text}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Details
                            </label>
                            <textarea
                                name="details"
                                value={formData.details}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Image
                            </label>
                            <div className="mt-1 flex items-center space-x-4">
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-20 w-20 object-cover rounded"
                                    />
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Speciality
                            </label>
                            <input
                                type="text"
                                name="speciality"
                                value={formData.speciality}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Final Price
                                </label>
                                <input
                                    type="number"
                                    name="finalPrice"
                                    value={formData.finalPrice}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {isMembership &&
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Bonus
                                    </label>
                                    <input
                                        type="number"
                                        name="bonus"
                                        value={formData.bonus}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Days
                                    </label>
                                    <input
                                        type="number"
                                        name="days"
                                        value={formData.days || 0}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Timings
                                    </label>
                                    <input
                                        type="text"
                                        name="timings"
                                        value={formData?.timings?.toString()}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>}

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isAvailable"
                                name="isAvailable"
                                checked={formData.isAvailable}
                                onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
                                Available for Purchase
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                    Creating...
                                </>
                            ) : (
                                'Update Product'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateProductForm;
