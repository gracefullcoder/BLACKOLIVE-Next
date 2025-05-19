"use client"
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { uploadFile } from '@/src/utility/ImageKit';
import axios from 'axios';
import { handleToast } from '@/src/utility/basic';
import { getProducts } from '@/src/actions/Product';

const ProductForm = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [formData, setFormData] = useState({
        title: '',
        details: '',
        image: '',
        speciality: '',
        price: 0,
        finalPrice: 0,
        isAvailable: true,
        bonus: 0,
        days: 0,
        timings: '',
        discountPercent: 0,
        products: []
    });

    const [isMembership, setIsMembership] = useState("membership");
    const [products, setProducts] = useState([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<any>('');
    const [selectedProduct, setSelectedProduct] = useState("");

    const calculatePrices = (products: any, memProductIds: any, discountPercent: any) => {
        const memebershipProducts = products.filter((p: any) => (memProductIds.includes(p?._id)));
        const price = memebershipProducts.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0);
        const finalPrice = Math.round(memebershipProducts.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * ((100 - discountPercent) / 100));
        return { price, finalPrice };
    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        if (name == "discountPercent") {
            const { price, finalPrice } = calculatePrices(products, formData.products, value);
            setFormData((prev: any) => ({ ...prev, price, finalPrice, [name]: value }));
        }
        else setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMembershipChange = (e: any) => {
        const { value } = e.target;
        setIsMembership(value);
    };

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
    
    console.log(formData)
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            let imageData: { fileId: string, url: string } = { fileId: "", url: "" };

            if (imageFile) {
                imageData = await uploadFile(imageFile);
            }

            const response: any = await axios.post('/api/admin/products', {
                ...formData,
                image: imageData.url,
                fileId: imageData.fileId,
                isMembership: isMembership == "membership" ? true : false
            });

            if (!response.status || response.status >= 400) {
                throw new Error('Failed to create product');
            }

            setMessage({ text: 'Product created successfully!', type: 'success' });

            setFormData({
                title: '',
                details: '',
                image: '',
                speciality: '',
                price: 0,
                finalPrice: 0,
                isAvailable: true,
                bonus: 0,
                days: 0,
                timings: '',
                discountPercent: 0,
                products: []
            });

            setImageFile(null);
            setImagePreview('');
        } catch (error) {
            console.log(error);
            setMessage({ text: 'Failed to create product', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedData = await getProducts("salads");
                console.log("apple");
                handleToast(fetchedData);
                if (fetchedData.success) setProducts(fetchedData.products);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        }
        fetchProducts();
    }, [])

    console.log(products)


    const handleAddProduct = () => {
        if (!selectedProduct) return;

        const product: any = products.find((p: any) => p._id == selectedProduct);

        setFormData((prev: any) => ({
            ...prev,
            price: prev.price + product?.finalPrice,
            finalPrice: Math.round(prev.finalPrice + product.finalPrice * ((100 - (formData?.discountPercent || 0)) / 100)),
            products: [...prev.products, selectedProduct]
        }));
    };

    const handleRemoveProduct = (pId: any) => {
        const membershipProducts = formData?.products?.filter((p: any) => p !== pId);
        const { price, finalPrice } = calculatePrices(products, membershipProducts, formData.discountPercent);
        setFormData((prev: any) => ({
            ...prev,
            products: membershipProducts,
            price, finalPrice
        }));
    }

    // useEffect(() => {
    //     const getAddtionals = async () => {
    //         const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/additionals`);
    //         handleToast(data);
    //         if(data.success) setAdditinals(data.additionals);
    //         console.log(data);
    //     }   

    //     getAddtionals();
    // }, [])


    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                        Create New
                    </h2>

                    <div className='text-xl text-center flex justify-center gap-4 mb-2'>
                        <label htmlFor="product" className='cursor-pointer'>
                            <span className='mr-1'>Product</span>
                            <input type="radio" name="vertical" id="product" value="product" checked={isMembership == "product"} onChange={handleMembershipChange} />
                        </label>
                        <label htmlFor="membership" className='cursor-pointer'>
                            <span className='mr-1'>Membership</span>
                            <input type="radio" name="vertical" id="membership" value="membership" checked={isMembership == "membership"} onChange={handleMembershipChange} />
                        </label>
                    </div>

                    {message.text && (
                        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Timings
                            </label>
                            <input
                                type="text"
                                name="timings"
                                value={formData.timings}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {
                            isMembership == "membership" && <>

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

                                    <div className='flex justify-between gap-4'>
                                        <select name="products"
                                            className="mt-1 p-2 block w-1/2 border-gray-300 rounded-md shadow-sm"
                                            onChange={(e) => setSelectedProduct(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            {products.map((product: any) => (
                                                <option value={product._id} key={product._id}>
                                                    {product.title}
                                                </option>
                                            ))}
                                        </select>
                                        <div
                                            className="mt-1 block w-1/2 border text-center cursor-pointer border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            onClick={handleAddProduct}
                                        >
                                            Add in Mebership
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

                                    {formData.products.length === 0 ? (
                                        <p>No product added</p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.products.map((product: any, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 border border-gray-300 px-3 py-1 rounded-md bg-gray-100"
                                                >
                                                    <span>
                                                        {(products.find((p: any) => p._id === product) as any)?.title}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() => handleRemoveProduct(product)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            </>
                        }

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
                                'Create Product'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;