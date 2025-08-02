"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { uploadFile } from "@/src/utility/ImageKit";
import axios from "axios";
import { getProducts, getSpecificProduct } from "@/src/actions/Product";
import { handleToast } from "@/src/utility/basic";

const UpdateProductForm = ({ productId, isMembership }: { productId: any, isMembership: boolean }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [formData, setFormData] = useState<any>(!isMembership ? {
        title: "",
        details: "",
        image: "",
        fileId: "",
        speciality: "",
        price: "",
        finalPrice: "",
        isAvailable: true,
        responses: [],
        timings: ""
    } :
        {
            title: "",
            details: "",
            image: "",
            fileId: "",
            speciality: "",
            price: 0,
            finalPrice: 0,
            isAvailable: true,
            days: 0,
            timings: [],
            bonus: 0,
            products: [],
            additionalProducts: [],
            discountPercent: 0,
            responses: []
        }
    );

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<any>('');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");


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


    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        if (name == "timings") {
            setFormData((prev: any) => ({ ...prev, [name]: value.split(",") }));
        }
        else if (name == "days") {
            let { price, finalPrice } = calculatePrices(formData.products, formData.discountPercent, value)
            setFormData((prev: any) => {
                return { ...prev, [name]: value, price, finalPrice }
            })
        }
        else if (name == "discountPercent") {
            const { price, finalPrice } = calculatePrices(formData?.products, formData.discountPercent);
            console.log(price, finalPrice)
            setFormData((prev: any) => ({ ...prev, price, finalPrice, [name]: value }));
        }
        else setFormData((prev: any) => ({ ...prev, [name]: value }));
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

            let data;

            if (isMembership) {
                data = {
                    ...formData, products: formData?.products?.map((p: any) => p._id), image: imageData.url,
                    id: productId,
                    isMembership
                };
            } else {
                data = {
                    ...formData,
                    image: imageData.url,
                    id: productId,
                    isMembership
                }
            }

            await axios.patch(`/api/admin/products`, data);

            setMessage({ text: "Product updated successfully!", type: "success" });
            router.push("/admin/products");
        } catch (error) {
            console.error("Error updating product:", error);
            setMessage({ text: "Failed to update product", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const calculatePrices = (memebershipProducts: any, discountPercent: any, days = formData?.days) => {
        const weeks = (days == 0 || memebershipProducts?.length == 0) ? 0 : ((days) / (memebershipProducts?.length));
        const price = memebershipProducts.reduce((sum: any, curr: any) => (sum + curr?.finalPrice), 0) * weeks;
        const finalPrice = Math.round(memebershipProducts.reduce((sum: any, curr: any) => (sum + curr?.finalPrice), 0) * ((100 - discountPercent) / 100)) * weeks;
        return { price, finalPrice };
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response: any = await getSpecificProduct(productId);
                console.log("apple", response)
                if (isMembership) {
                    const { price, finalPrice } = calculatePrices(response?.product?.products, response?.product?.discountPercent, response?.product?.days);
                    setFormData({ ...response.product, price, finalPrice });
                    const allProducts = await getProducts("salads");
                    setProducts(allProducts.products);
                } else {
                    setFormData({ ...response?.product });
                }
                setImagePreview(response?.image);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }

        }

        fetchProducts();
    }, [productId])

    console.log(products)

    const handleAddProduct = (isAdditional: boolean) => {
        if (!selectedProduct) return;

        const product: any = products.find((p: any) => p._id == selectedProduct);

        if (isAdditional) {
            setFormData((prev: any) => ({
                ...prev,
                additionalProducts: [...prev.additionalProducts, product]
            }));
            return;
        }

        const { price, finalPrice } = calculatePrices([...formData.products, product], formData.discountPercent);

        setFormData((prev: any) => ({
            ...prev,
            price,
            finalPrice,
            products: [...prev.products, product]
        }));
    };

    const handleRemoveProduct = (pId: any, isAdditional: boolean) => {
        if (isAdditional) {
            const membershipProducts = formData?.additionalProducts?.filter((p: any) => p !== pId);
            setFormData((prev: any) => ({
                ...prev,
                additionalProducts: membershipProducts
            }));
        } else {
            const membershipProducts = formData?.products?.filter((p: any) => p !== pId);
            console.log(membershipProducts);
            const { price, finalPrice } = calculatePrices(membershipProducts, formData.discountPercent);
            setFormData((prev: any) => ({
                ...prev,
                products: membershipProducts,
                price, finalPrice
            }));
        }
    }

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


                        {
                            isMembership ?
                                <>
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
                                    <div className="grid grid-cols-3 gap-4">
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
                                                value={formData.days}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Discount
                                            </label>
                                            <input
                                                type="number"
                                                name="discountPercent"
                                                value={formData.discountPercent}
                                                onChange={handleInputChange}
                                                className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />

                                        </div>

                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Add Products
                                        </label>

                                        <div>
                                            <select name="products"
                                                className="mt-1 w-full p-2 block w-1/2 border-gray-300 rounded-md shadow-sm"
                                                onChange={(e) => setSelectedProduct(e.target.value)}
                                            >
                                                <option value="">Select</option>
                                                {products.map((product: any) => (
                                                    <option value={product._id} key={product._id}>
                                                        {product.title}
                                                    </option>
                                                ))}
                                            </select>

                                            <div className='flex justify-between gap-4'>

                                                <div
                                                    className="mt-1 block w-1/2 border text-center cursor-pointer border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    onClick={() => handleAddProduct(false)}
                                                >
                                                    Add in Mebership
                                                </div>

                                                <div
                                                    className="mt-1 block w-1/2 border text-center cursor-pointer border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    onClick={() => handleAddProduct(true)}
                                                >
                                                    Add in Additional
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Price
                                            </label>
                                            <div
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                {formData.price}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Final Price
                                            </label>
                                            <div
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                {formData.finalPrice}
                                            </div>
                                        </div>
                                    </div>



                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Selected Products
                                        </label>



                                        {formData?.products?.length === 0 ? (
                                            <p>No product added</p>
                                        ) : (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {formData?.products?.map((product: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2 border border-gray-300 px-3 py-1 rounded-md bg-gray-100"
                                                    >
                                                        <span>
                                                            {product?.title}
                                                        </span>
                                                        <span>
                                                            {product?.price}
                                                        </span>
                                                        <span>
                                                            {product?.finalPrice}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() => handleRemoveProduct(product, false)}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    </div>


                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Additional Products
                                        </label>

                                        {formData.products.length === 0 ? (
                                            <p>No product added</p>
                                        ) : (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {formData.additionalProducts.map((product: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2 border border-gray-300 px-3 py-1 rounded-md bg-gray-100"
                                                    >
                                                        <span>
                                                            {product?.title}
                                                        </span>
                                                        <span>
                                                            {product?.price}
                                                        </span>
                                                        <span>
                                                            {product?.finalPrice}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() => handleRemoveProduct(product, true)}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </> :
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

                        }

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isAvailable"
                                name="isAvailable"
                                checked={formData.isAvailable}
                                onChange={(e) => setFormData((prev: any) => ({ ...prev, isAvailable: e.target.checked }))}
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
