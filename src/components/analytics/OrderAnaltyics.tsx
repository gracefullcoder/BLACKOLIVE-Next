"use client"
import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function OrderAnalytics({ orders }: any) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredOrders, setFilteredOrders] = useState<any>([]);
    const [analytics, setAnalytics] = useState<any>({
        mostOrderedProduct: { title: '', count: 0 },
        totalRevenue: 0,
        totalOrders: 0,
        topDeliveryPerson: { id: '', count: 0 },
        customerAnalytics: [],
        productOrderCounts: []
    });

    const applyFilters = () => {
        let filtered = orders;

        if (startDate && endDate) {
            filtered = orders.filter((order: any) => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
            });
        }

        setFilteredOrders(filtered);
        calculateAnalytics(filtered);
    };
    // Calculate all analytics metrics
    const calculateAnalytics = (filteredOrders: any) => {
        // Most ordered product
        const productOrderCounts: any = {};
        filteredOrders.forEach((order: any) => {
            order.orders.forEach((item: any) => {
                const productId = item.product._id;
                const productTitle = item.product.title;
                if (!productOrderCounts[productId]) {
                    productOrderCounts[productId] = {
                        title: productTitle,
                        count: 0
                    };
                }
                productOrderCounts[productId].count += item.quantity;
            });
        });

        const mostOrdered = Object.values(productOrderCounts).reduce((max: any, { title, count }: any) => {
            return count > max.count ? { title, count } : max;
        }, { title: '', count: 0 });

        // Calculate revenue and delivery stats
        const revenue = filteredOrders.reduce((total: any, order: any) => {
            return total + order.orders.reduce((orderTotal: any, item: any) => {
                return orderTotal + (item.product.finalPrice * item.quantity);
            }, 0);
        }, 0);

        // Delivery person stats
        const deliveryStats: any = {};
        filteredOrders.forEach((order: any) => {
            if (order.assignedTo) {
                deliveryStats[order.assignedTo] = (deliveryStats[order.assignedTo] || 0) + 1;
            }
        });

        // Customer analytics
        const customerStats: any = {};
        filteredOrders.forEach((order: any) => {
            const userId = order.user._id;
            if (!customerStats[userId]) {
                customerStats[userId] = { name: order.user.name, email: order.user.email, revenue: 0, orderCount: 0 };
            }
            customerStats[userId].orderCount += 1;
            customerStats[userId].revenue += order.orders.reduce((total: any, item: any) => {
                return total + (item.product.finalPrice * item.quantity);
            }, 0);
        });

        const sortedCustomers = Object.entries(customerStats)
            .map(([id, stats]: any) => ({ id, ...stats }))
            .sort((a, b) => b.revenue - a.revenue);

        setAnalytics({
            mostOrderedProduct: mostOrdered,
            totalRevenue: revenue,
            totalOrders: filteredOrders.length,
            topDeliveryPerson: Object.entries(deliveryStats).reduce(
                (max, [id, count]: any) => count > max.count ? { id, count } : max,
                { id: '', count: 0 }
            ),
            customerAnalytics: sortedCustomers,
            productOrderCounts: Object.values(productOrderCounts)
        });
    };

    // Generate and download Excel
    const downloadExcel = () => {
        let csv = 'Order ID,Date,Customer Name,Customer Email,Address,Mobile Number,Status,Assigned To,Products,Quantity,Price,Total\n';

        let grandTotal = 0;
        filteredOrders.forEach((order: any) => {
            let orderTotal = 0;
            order.orders.forEach((item: any) => {
                const total = item.quantity * item.product.finalPrice;
                orderTotal += total;
                const address = `${order?.address?.address || ""} ${order?.address?.landmark || ""} ${order?.address?.pincode || 0}`.replaceAll(",", "|")
                console.log(address)
                csv += `${order._id},${new Date(order.createdAt).toLocaleDateString()},${order.user.name},${order.user.email},${address},${order.contact},${order.status},${order.assignedTo || "unassigned"},"${item.product.title}",${item.quantity},${item.product.finalPrice},${total}\n`;
            });
            csv += `,,,,,,,,,,,Order Total: ${orderTotal}\n`;
            grandTotal += orderTotal;
        });

        csv += `,,,,,,,,,,,Grand Total: ${grandTotal}\n`;

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'order_analytics.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    useEffect(() => {
        setFilteredOrders(orders);
        calculateAnalytics(orders);
    }, []);


    return (
        <div className="space-y-6 p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <h1 className="text-2xl font-bold">Order Analytics</h1>
                <div className="flex gap-4 flex-wrap">
                    <div className='flex gap-4'>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded p-2"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border rounded p-2"
                        />
                    </div>
                    <div className='flex gap-4'>
                        <button onClick={applyFilters} className="bg-blue-500 text-white px-4 py-2 rounded">
                            Apply Filter
                        </button>
                        <button onClick={downloadExcel} className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Excel
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded shadow">
                    <h2 className="text-lg font-bold">Most Ordered Product</h2>
                    <p className="text-2xl">{analytics.mostOrderedProduct.title}</p>
                    <p className="text-gray-500">Ordered {analytics.mostOrderedProduct.count} times</p>
                </div>

                <div className="p-4 border rounded shadow">
                    <h2 className="text-lg font-bold">Total Revenue</h2>
                    <p className="text-2xl">₹{analytics.totalRevenue}</p>
                    <p className="text-gray-500">{analytics.totalOrders} orders</p>
                </div>

                <Link href={`/admin/users/details?userId=${analytics.topDeliveryPerson.id}`}>
                    <div className="p-4 border rounded shadow">
                        <h2 className="text-lg font-bold">Top Delivery Person</h2>
                        <p className="text-lg">ID: {analytics.topDeliveryPerson.id}</p>
                        <p className="text-gray-500">{analytics.topDeliveryPerson.count} deliveries</p>
                    </div>
                </Link>

            </div>

            <div className="p-4 border rounded shadow">
                <h2 className="text-lg font-bold">Product Order Counts</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="text-left p-2 border">Product Title</th>
                                <th className="text-left p-2 border">Order Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics?.productOrderCounts?.map((product: any) => (
                                <tr key={product.title}>
                                    <td className="p-2 border">{product.title}</td>
                                    <td className="p-2 border">{product.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-4 border rounded shadow">
                <h2 className="text-lg font-bold">Top Customers</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="text-left p-2 border">Customer ID</th>
                                <th className="text-left p-2 border">Total Orders</th>
                                <th className="text-left p-2 border">Total Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.customerAnalytics.map((customer: any) => (
                                <tr key={customer.id}>

                                    <td className="p-2 border cursor-pointer">
                                        <Link href={`/admin/users/details?userId=${customer.id}`}>
                                            <p>{customer.id}</p>
                                            <p>{customer.name}</p>
                                            <p>{customer.email}</p>
                                        </Link>
                                    </td>
                                    <td className="p-2 border">{customer.orderCount}</td>
                                    <td className="p-2 border">₹{customer.revenue}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}