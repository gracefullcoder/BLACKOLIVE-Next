"use client"
import React, { useEffect, useState } from 'react';
import { User, Plus, Pencil, Save, X, MapPin, Trash2 } from 'lucide-react';
import axios from 'axios';
import MyOrders from '../order/MyOrders';
import { getOrders } from '@/src/actions/Order';
import { toast } from 'react-toastify';

interface Address {
    _id?: String,
    number: string,
    address: string,
    landmark: string,
    pincode: number | string
}

const UserProfile = ({ user }: any) => {
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [contact, setContact] = useState(user?.contact || '');
    const [newAddress, setNewAddress] = useState({
        number: '',
        address: '',
        landmark: '',
        pincode: ''
    });

    const [orders, setOrders] = useState({ orderDetails: [], membershipDetails: [] });

    useEffect(() => {
        const fetchOrders = async () => {
            if (user) {
                try {
                    const response = await getOrders(user._id);
                    setOrders(response.data || { orderDetails: [], membershipDetails: [] });
                } catch (error) {
                    console.error("Failed to fetch orders:", error);
                    setOrders({ orderDetails: [], membershipDetails: [] });
                }
            }
        };

        fetchOrders();
    }, [user]);


    console.log(user)
    const handleContactSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const res = await axios.put('/api/user/contact', { id: user._id, contact });
            if (res.status && res.status < 400) {
                setIsEditingContact(false)
                user.contact = contact
            }
        } catch (error) {
            console.error('Failed to update contact:', error);
        }
    };

    const handleAddressSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const res: any = await axios.post('/api/user/address', { id: user._id, address: { ...newAddress, pincode: parseInt(newAddress.pincode) } });

            if (res.status && res.status < 400) {
                setIsAddingAddress(false);
                setNewAddress({ number: '', address: '', landmark: '', pincode: '' });
                if (res?.data?.addresses?.length) {
                    user.addresses = res?.data?.addresses
                }
            }

        } catch (error) {
            console.error('Failed to add address:', error);
        }
    };

    const handleUpdateAddress = async (e: any) => {
        e.preventDefault();
        if (!editingAddress) return;

        try {
            const res = await axios.put('/api/user/address', {
                id: user._id,
                addressId: editingAddress._id,
                updatedAddress: {
                    ...editingAddress,
                    pincode: parseInt(editingAddress.pincode.toString())
                }
            });

            if (res.status && res.status < 400) {
                const updatedAddresses = user.addresses.map((addr: Address) =>
                    addr._id === editingAddress._id ? editingAddress : addr
                );
                user.addresses = updatedAddresses;
                setEditingAddress(null);
            }

        } catch (error) {
            console.error('Failed to update address:', error);
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        try {
            const res = await axios.delete('/api/user/address', {
                data: {
                    id: user._id,
                    addressId
                }
            });

            if (res.status && res.status < 400) {
                if (res?.data?.addresses?.length) {
                    user.addresses = res?.data?.addresses
                }
                toast.success("Deleted!")
            }

        } catch (error) {
            console.error('Failed to delete address:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt={user.name}
                                        className="h-24 w-24 rounded-full border-4 border-white object-cover"
                                    />
                                ) : (
                                    <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                                        <User size={40} className="text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="text-white overflow-hidden">
                                <h1 className="text-2xl font-bold">{user?.name}</h1>
                                <p className="text-blue-100">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-700">Contact Information</h2>
                            <button
                                onClick={() => setIsEditingContact(!isEditingContact)}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                {isEditingContact ? <X size={20} /> : <Pencil size={20} />}
                            </button>
                        </div>

                        {isEditingContact ? (
                            <form onSubmit={handleContactSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        value={contact}
                                        onChange={(e) => setContact((prev: any) => parseInt(e.target.value) ? parseInt(e.target.value) : '')}
                                        placeholder="Enter contact number"
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        maxLength={10}
                                        pattern="[0-9]{10}"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <Save size={16} /> Save Contact
                                </button>
                            </form>
                        ) : (
                            <p className="text-gray-600">
                                {user?.contact || 'No contact number added'}
                            </p>
                        )}
                    </div>

                    {/* Addresses */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-700">Addresses</h2>
                            <button
                                onClick={() => setIsAddingAddress(!isAddingAddress)}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                {isAddingAddress ? <X size={20} /> : <Plus size={20} />}
                            </button>
                        </div>

                        {isAddingAddress && (
                            <form onSubmit={handleAddressSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            House/Flat Number
                                        </label>
                                        <input
                                            type="text"
                                            value={newAddress.number}
                                            onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Pincode
                                        </label>
                                        <input
                                            type="number"
                                            value={newAddress.pincode}
                                            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value.slice(0, 6) })}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <textarea
                                        value={newAddress.address}
                                        onChange={(e: any) => setNewAddress({ ...newAddress, address: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={2}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Landmark
                                    </label>
                                    <input
                                        type="text"
                                        value={newAddress.landmark}
                                        onChange={(e: any) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <Save size={16} /> Save Address
                                </button>
                            </form>
                        )}

                        {editingAddress && (
                            <form onSubmit={handleUpdateAddress} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            House/Flat Number
                                        </label>
                                        <input
                                            type="text"
                                            value={editingAddress.number}
                                            onChange={(e) => setEditingAddress({ ...editingAddress, number: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Pincode
                                        </label>
                                        <input
                                            type="number"
                                            value={editingAddress.pincode}
                                            onChange={(e) => setEditingAddress({
                                                ...editingAddress,
                                                pincode: e.target.value.slice(0, 6)
                                            })}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <textarea
                                        value={editingAddress.address}
                                        onChange={(e) => setEditingAddress({ ...editingAddress, address: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={2}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Landmark
                                    </label>
                                    <input
                                        type="text"
                                        value={editingAddress.landmark}
                                        onChange={(e) => setEditingAddress({ ...editingAddress, landmark: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <Save size={16} /> Update Address
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingAddress(null)}
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center gap-2"
                                    >
                                        <X size={16} /> Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="space-y-4">
                            {user?.addresses?.map((address: any, index: number) => (
                                <div key={address?._id || index} className="p-4 border rounded-lg flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-blue-600 mt-1" size={20} />
                                        <div>
                                            <p className="text-gray-800">#{address.number}, {address.address}</p>
                                            {address.landmark && (
                                                <p className="text-gray-600 text-sm">Landmark: {address.landmark}</p>
                                            )}
                                            <p className="text-gray-600 text-sm">Pincode: {address.pincode}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingAddress(address)}
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAddress(address?._id || "")}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {!user?.addresses?.length && !isAddingAddress && (
                                <p className="text-gray-500 text-center py-4">No addresses added yet</p>
                            )}
                        </div>
                    </div>

                    <MyOrders orders={orders} />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;