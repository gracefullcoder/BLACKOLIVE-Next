"use client";
import { updateMembershipStatus, updateOrderStatus } from "@/src/actions/Order";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function SelectDeliveryUser({ users, orderId, isMembership, setOrders, setError }: any) {
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [selectedUser, setSelectedUser] = useState("");

    useEffect(() => {
        setFilteredUsers(
            users.filter((user: any) =>
                user.email.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, users]);

    const handleAssign = async (newStatus: any) => {
        try {
            if(selectedUser){
                const updatedOrder = !isMembership ? await updateOrderStatus(orderId, newStatus, true, selectedUser) : await updateMembershipStatus(orderId, newStatus, true, selectedUser);
            console.log("updatedorder status", updatedOrder)
            if (updatedOrder?.success) {
                setOrders((prev: any) => (prev.map((order: any) =>
                    order._id === orderId ? updatedOrder.product : order
                )));
                toast.success(updatedOrder.message);
            } else {
                toast(updatedOrder?.message)
            }
            }else{
                toast.error("Select Delivery User!")
            }

        } catch (err) {
            setError('Failed to update order status');
            console.error(err);
        }
    };


    return (
        <div className="p-4 border rounded-lg shadow-md">
            <input
                type="text"
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 border rounded mb-3"
            />

            <select
                className="w-full p-2 border rounded"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
            >
                <option value="">Select a delivery user</option>
                {filteredUsers.map((user: any) => (
                    <option key={user._id} value={user._id}>
                        {user.email}
                    </option>
                ))}
            </select>

            <button
                onClick={() => handleAssign("assign")}
                className="mt-3 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Assign
            </button>
        </div>
    );
}

export default SelectDeliveryUser;
