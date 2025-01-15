"use client"
import React, { useState, useEffect } from 'react';
import { 
    getAllOrders, 
    updateOrderStatus, 
    updateOrderQuantity, 
    removeProductFromOrder,
    getFilteredOrders 
} from '@/src/actions/Order';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [error, setError] = useState('');

    // Fetch orders on component mount
    useEffect(() => {
        fetchOrders();
    }, []);

    // Fetch orders based on filters
    useEffect(() => {
        if (timeFilter === 'all' && statusFilter === 'all') {
            fetchOrders();
        } else {
            fetchFilteredOrders();
        }
    }, [timeFilter, statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getAllOrders();
            setOrders(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredOrders = async () => {
        try {
            setLoading(true);
            const status = statusFilter === 'all' ? null : statusFilter === 'delivered';
            const time = timeFilter === 'all' ? null : timeFilter;
            const data = await getFilteredOrders(time, status);
            setOrders(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch filtered orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId:any, newStatus:any) => {
        try {
            const updatedOrder = await updateOrderStatus(orderId, newStatus);
            setOrders(orders.map((order:any) => 
                order._id === orderId ? updatedOrder : order
            ));
            setError('');
        } catch (err) {
            setError('Failed to update order status');
            console.error(err);
        }
    };

    const handleQuantityUpdate = async (orderId:any, productId:any, newQuantity:any) => {
        try {
            const updatedOrder = await updateOrderQuantity(orderId, productId, newQuantity);
            setOrders(orders.map((order:any) => 
                order._id === orderId ? updatedOrder : order
            ));
            setError('');
        } catch (err) {
            setError('Failed to update quantity');
            console.error(err);
        }
    };

    const handleRemoveProduct = async (orderId:any, productId:any) => {
        try {
            const updatedOrder = await removeProductFromOrder(orderId, productId);
            setOrders(orders.map((order:any) => 
                order._id === orderId ? updatedOrder : order
            ));
            setError('');
        } catch (err) {
            setError('Failed to remove product');
            console.error(err);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    return (
        <div className="p-4 max-w-7xl mx-auto">
            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
            
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Membership Management</h1>
                
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="all">All Orders</option>
                        <option value="delivered">Delivered</option>
                        <option value="pending">Pending</option>
                    </select>

                    <select 
                        value={timeFilter} 
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="all">All Times</option>
                        <option value="morning">Morning (6AM-12PM)</option>
                        <option value="afternoon">Afternoon (12PM-5PM)</option>
                        <option value="evening">Evening (5PM-10PM)</option>
                        <option value="night">Night (10PM-6AM)</option>
                    </select>
                </div>
            </div>

            {/* Orders Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {orders.map((order:any) => (
                    <div key={order._id} className="border rounded-lg p-4 bg-white shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold">Order #{order._id.slice(-6)}</h2>
                            <span className={`px-2 py-1 rounded text-sm ${
                                order.status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {order.status ? 'Delivered' : 'Pending'}
                            </span>
                        </div>

                        <div className="mb-4">
                            <p>Delivery Time: {order.time}:00</p>
                            <p>Contact: {order.contact}</p>
                            <p className="text-sm">
                                Address: {order.address.address}, {order.address.landmark}, {order.address.pincode}
                            </p>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-semibold mb-2">Products</h3>
                            {order.orders.map((item:any) => (
                                <div key={item._id} className="mb-4 p-2 bg-gray-50 rounded">
                                    <div className="flex justify-between items-start mb-2">
                                        <span>{item.product.title}</span>
                                        <button 
                                            onClick={() => handleRemoveProduct(order._id, item._id)}
                                            className="text-red-600 text-sm hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityUpdate(
                                                order._id, 
                                                item._id, 
                                                parseInt(e.target.value)
                                            )}
                                            className="border rounded w-20 p-1"
                                            min="1"
                                        />
                                        <span className="text-sm text-gray-600">
                                            x ₹{item.product.finalPrice}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => handleStatusUpdate(order._id, !order.status)}
                            className={`mt-4 px-4 py-2 rounded w-full ${
                                order.status 
                                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                        >
                            {order.status ? 'Mark as Pending' : 'Mark as Delivered'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}