import React, { useState, useEffect } from 'react'
import UserSearch from "@/src/components/adminorders/UserSearch";
import UserDetails from "@/src/components/adminorders/UserDetails";
import AddressForm from "@/src/components/adminorders/AddressForm";
import AddressList from "@/src/components/adminorders/AddressList";
import axios from "axios";
import { getUserByMail, getUserByContact } from "@/src/actions/User";
import { toast } from 'react-toastify';

function AdminOrder({ user, setUser, orderDetails, setOrderDetails }: any) {

    const [email, setEmail] = useState("");
    const [contact, setContact] = useState<number | string>("");
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        number: "",
        pincode: "",
        address: "",
        landmark: "",
    });


    const handleUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await getUserByMail(email);
            if (result?.success) {
                setUser(result.user);
                toast.success("User fetched successfully!");
            } else {
                toast.error("User not found!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching user by email.");
        }
    };

    const handleUserPhno = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await getUserByContact(contact);
            if (result?.success) {
                setUser(result.user);
                if (result.user.contact) {
                    setOrderDetails((prev: any) => ({ ...prev, contact: result.user.contact }))

                }
                toast.success("User fetched successfully!");
            } else {
                toast.error("User not found!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching user by contact.");
        }
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            const response = await axios.put('/api/user/contact', { id: user._id, contact });
            if (response.data.success) {
                setUser((prev: any) => ({ ...prev, contact: contact }));
                setOrderDetails((prev: any) => ({ ...prev, contact: contact }))
                setIsEditingContact(false);
                toast.success("Contact updated successfully!");
            } else {
                toast.error("Failed to update contact.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating contact.");
        }
    };

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            const updatedAddresses = [...(user.addresses || []), newAddress];
            const response = await axios.post('/api/user/address', { id: user._id, address: newAddress });
            if (response.data.success) {
                setUser((prev: any) => ({ ...prev, addresses: updatedAddresses }));
                setNewAddress({ number: "", pincode: "", address: "", landmark: "" });
                setIsAddingAddress(false);
                toast.success("Address added successfully!");
            } else {
                toast.error("Failed to add address.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error adding address.");
        }
    };

    return (
        <div>
            <UserSearch setEmail={setEmail} setContact={setContact} handleUser={handleUser} handleUserPhno={handleUserPhno} />

            {user && (
                <>

                    <UserDetails
                        user={user}
                        isEditingContact={isEditingContact}
                        setIsEditingContact={setIsEditingContact}
                        handleContactSubmit={handleContactSubmit}
                        setContact={setContact}
                    />


                    <AddressList
                        user={user}
                        setOrderDetails={setOrderDetails}
                        setIsAddingAddress={setIsAddingAddress}
                        isAddingAddress={isAddingAddress}
                    />


                    <AddressForm
                        isAddingAddress={isAddingAddress}
                        handleAddressSubmit={handleAddressSubmit}
                        newAddress={newAddress}
                        setNewAddress={setNewAddress}
                    />

                    <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
                        <h3 className="font-semibold text-lg mb-4 text-gray-700">Logistics Summary</h3>
                        <div className="mb-6">
                            <label className="block text-gray-600 mb-2">Contact Details:</label>
                            <input
                                type="number"
                                value={orderDetails.contact || ""}
                                onChange={(e) => setOrderDetails((prev: any) => ({ ...prev, contact: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-600 mb-2">Selected Address:</label>
                            {orderDetails.address != null ? (
                                <div className="p-4 border rounded-md bg-gray-50">
                                    <p className="font-medium">{user?.addresses?.[orderDetails.address]?.number}</p>
                                    <p>{user?.addresses?.[orderDetails.address]?.address}</p>
                                    <p className="text-gray-600">{user?.addresses?.[orderDetails.address]?.landmark}</p>
                                    <p className="text-gray-600">{user?.addresses?.[orderDetails.address]?.pincode}</p>
                                </div>
                            ) : (
                                <div className="m-4 text-red-600">Please Select Delivery Address</div>
                            )}
                        </div>
                    </div>


                </>
            )}
        </div>
    )
}

export default AdminOrder