"use client"
import React, { useState } from 'react'
import { uploadFile } from '@/src/utility/ImageKit';
import { Loader2 } from 'lucide-react';
import { updateFeature } from '@/src/actions/Features';

function page() {

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<any>('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

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
            let imageData: { fileId: string, url: string } = { fileId: "", url: "" };

            if (imageFile) {
                imageData = await uploadFile(imageFile);
            }

            const response: any = updateFeature(imageData.url, imageData.fileId)

            if (response.success) {
                setMessage({ text: 'Product created successfully!', type: 'success' });
                setImageFile(null);
                setImagePreview('');
            }

        } catch (error) {
            console.log(error);
            setMessage({ text: 'Failed to create product', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='w-1/2 mx-auto'>
                {message.text && (
                    <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}
                <h1>Features</h1>
                <input type="file" name='heroImage' onChange={handleImageChange} />
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded"
                    />
                )}

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
                        'Update Hero Image'
                    )}
                </button>
            </form>
        </div>
    )
}

export default page