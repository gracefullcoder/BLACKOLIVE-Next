import React, { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import { downloadExcel, generateOrderReceipt } from './analyticsFunctions';

const OrderTable = ({ orders }: any) => {
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [statusFilter, setStatusFilter] = useState('all');
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const calculateOrderTotal = (order: any) => {
        return order.orders.reduce((total: any, item: any) => {
            const itemTotal = item.product.finalPrice * item.quantity;
            const extraCharge = item.extraCharge || 0;
            return total + itemTotal + extraCharge;
        }, 0);
    };



    useEffect(() => {
        if (statusFilter === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter((order: any) => order.status === statusFilter));
        }
    }, [statusFilter, orders]);

    const totalRevenue = filteredOrders
        .filter((order: any) => order.status !== 'cancelled')
        .reduce((total: number, order: any) => total + calculateOrderTotal(order), 0);

    const totalExtraCharges = filteredOrders
        .filter((order: any) => order.status !== 'cancelled')
        .reduce((total: number, order: any) => {
            return total + order.orders.reduce((orderTotal: number, item: any) => {
                return orderTotal + (item.extraCharge || 0);
            }, 0);
        }, 0);

    return (
        <div className="w-full bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <div className="relative">

                    <div className='flex gap-2 flex-wrap max-sm:justify-center'>
                        <button
                            onClick={() => setIsSelectOpen(!isSelectOpen)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {statusFilter === 'all' ? 'All Orders' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                        </button>
                        <button onClick={() => downloadExcel(filteredOrders)} className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Excel
                        </button>
                    </div>


                    {isSelectOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                                {['all', 'delivered', 'cancelled', 'pending', 'assigned'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setStatusFilter(status);
                                            setIsSelectOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600">Total Revenue</p>
                        <p className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">Total Extra Charges</p>
                        <p className="text-2xl font-bold">₹{totalExtraCharges.toFixed(2)}</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left border">Order ID</th>
                                <th className="p-2 text-left border">Date</th>
                                <th className="p-2 text-left border">Customer</th>
                                <th className="p-2 text-left border">Items</th>
                                <th className="p-2 text-left border">Status</th>
                                <th className="p-2 text-left border">Assigned To</th>
                                <th className="p-2 text-right border">Total</th>
                                <th className="p-2 text-center border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order: any) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="p-2 border">{order._id.slice(-6)}</td>
                                    <td className="p-2 border">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-2 border">
                                        <div>
                                            <p className="font-medium">{order.user.name}</p>
                                            <p className="text-sm text-gray-500">{order.user.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-2 border">
                                        {order.orders.map((item: any, index: number) => (
                                            <div key={index} className="text-sm">
                                                {item.quantity}x {item.product.title}
                                                {item.extraCharge > 0 &&
                                                    <span className="text-blue-600"> (+₹{item.extraCharge})</span>
                                                }
                                            </div>
                                        ))}
                                    </td>
                                    <td className="p-2 border">
                                        <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-2 text-left border">
                                        <p>{order?.assignedTo?._id || ""}</p>
                                        <p>{order?.assignedTo?.name || ""}</p>
                                    </td>
                                    <td className="p-2 text-right border">
                                        ₹{calculateOrderTotal(order)}
                                    </td>
                                    <td className="p-2 text-center border">
                                        <button
                                            onClick={() => generateOrderReceipt(order)}
                                            className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-blue-600"
                                            title="Download Receipt"
                                        >
                                            <FileText className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderTable;