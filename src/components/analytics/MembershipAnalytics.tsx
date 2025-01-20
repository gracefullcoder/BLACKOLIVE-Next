"use client"
import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
// import { Link } from 'next/link';

export default function MembershipAnalytics({ memberships }: any) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredMemberships, setFilteredMemberships] = useState<any>([]);
    const [analytics, setAnalytics] = useState<any>({
        activeMembershipCounts: {},
        totalActiveMemberships: 0,
        totalRevenue: 0,
        topCategories: [],
    });

    const applyFilters = () => {
        let filtered = memberships;

        // Apply start date and end date filter
        if (startDate && endDate) {
            filtered = memberships.filter((membership: any) => {
                const membershipStartDate = new Date(membership.startDate);
                return membershipStartDate >= new Date(startDate) && membershipStartDate <= new Date(endDate);
            });
        }

        // Apply active membership filter (startDate <= today && status === 'pending')
        filtered = filtered.filter((membership: any) => {
            const today = new Date();
            const membershipStartDate = new Date(membership.startDate);
            return membershipStartDate <= today && membership.status === 'pending';
        });

        setFilteredMemberships(filtered);
        calculateAnalytics(filtered);
    };

    const calculateAnalytics = (filteredMemberships: any) => {
        const categoryCounts: any = {};
        let totalRevenue = 0;

        // Loop through filtered memberships to calculate analytics
        filteredMemberships.forEach((membership: any) => {
            // Count memberships per category
            const category = membership.category.title;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;

            // Calculate total revenue
            totalRevenue += membership.category.finalPrice;
        });

        // Sort categories by the number of active memberships
        const topCategories = Object.entries(categoryCounts)
            .map(([category, count]: any) => ({ category, count }))
            .sort((a, b) => b.count - a.count);

        setAnalytics({
            activeMembershipCounts: categoryCounts,
            totalActiveMemberships: filteredMemberships.length,
            totalRevenue,
            topCategories,
        });
    };

    // Generate and download Excel
    const downloadExcel = () => {
        let csv = 'Membership ID,Start Date,Category,Status,Assigned To,Price,Total\n';
        let grandTotal = 0;

        filteredMemberships.forEach((membership: any) => {
            const total = membership.category.finalPrice;
            grandTotal += total;
            csv += `${membership._id},${new Date(membership.startDate).toLocaleDateString()},${membership.category.title},${membership.status},${membership.assignedTo || "unassigned"},${membership.category.finalPrice},${total}\n`;
        });

        csv += `,,,,,,Grand Total: ${grandTotal}\n`;

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'membership_analytics.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    useEffect(() => {
        setFilteredMemberships(memberships);
        calculateAnalytics(memberships);
    }, []);

    return (
        <div className="space-y-6 p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <h1 className="text-2xl font-bold">Membership Analytics</h1>
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
                    <h2 className="text-lg font-bold">Total Active Memberships</h2>
                    <p className="text-2xl">{analytics.totalActiveMemberships}</p>
                    <p className="text-gray-500">Memberships</p>
                </div>

                <div className="p-4 border rounded shadow">
                    <h2 className="text-lg font-bold">Total Revenue</h2>
                    <p className="text-2xl">₹{analytics.totalRevenue}</p>
                    <p className="text-gray-500">{analytics.totalActiveMemberships} active memberships</p>
                </div>
            </div>

            <div className="p-4 border rounded shadow">
                <h2 className="text-lg font-bold">Active Memberships by Category</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="text-left p-2 border">Category</th>
                                <th className="text-left p-2 border">Active Membership Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.topCategories?.map((category: any) => (
                                <tr key={category.category}>
                                    <td className="p-2 border">{category.category}</td>
                                    <td className="p-2 border">{category.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Active Memberships</h2>
            <div className='overflow-x-auto'>
                <table className="min-w-full table-auto border-collapse overflow-x-auto w-fit">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border">Category</th>
                            <th className="py-2 px-4 border">Start Date</th>
                            <th className="py-2 px-4 border">Days Delivered</th>
                            <th className="py-2 px-4 border">Address</th>
                            <th className="py-2 px-4 border">Assigned To</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memberships.map((order: any) => {
                            const daysDelivered = order.deliveryDates.length;
                            const categoryTitle = order.category.title;
                            const { number, address, landmark, pincode } = order.address;
                            const assignedTo = order.assignedTo ? 'Assigned' : 'Unassigned';
                            return (
                                <tr key={order._id}>
                                    <td className="py-2 px-4 border">{categoryTitle}</td>
                                    <td className="py-2 px-4 border">{new Date(order.startDate).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border">{daysDelivered} / {order.category.days}</td>
                                    <td className="py-2 px-4 border">{`${number} ${address}, ${landmark}, ${pincode}`}</td>
                                    <td className="py-2 px-4 border">{assignedTo}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Filtered Membership Table based on Date Range */}
            <div>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Filtered Memberships</h2>
                {/* <div className="mb-4">
                    <label className="mr-2">Start Date:</label>
                    <input
                        type="date"
                        value={startDateRange}
                        onChange={(e) => setStartDateRange(e.target.value)}
                        className="px-2 py-1 border rounded"
                    />
                    <label className="ml-4 mr-2">End Date:</label>
                    <input
                        type="date"
                        value={endDateRange}
                        onChange={(e) => setEndDateRange(e.target.value)}
                        className="px-2 py-1 border rounded"
                    />
                </div> */}

                <div className='overflow-x-auto'>
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">Category</th>
                                <th className="py-2 px-4 border">Start Date</th>
                                <th className="py-2 px-4 border">Days Delivered</th>
                                <th className="py-2 px-4 border">Address</th>
                                <th className="py-2 px-4 border">Assigned To</th>
                                <th className="py-2 px-4 border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMemberships.map((order: any) => {
                                const daysDelivered = order.deliveryDates.length;
                                const categoryTitle = order.category.title;
                                const { number, address, landmark, pincode } = order.address;
                                const assignedTo = order.assignedTo ? 'Assigned' : 'Unassigned';
                                return (
                                    <tr key={order._id}>
                                        <td className="py-2 px-4 border">{categoryTitle}</td>
                                        <td className="py-2 px-4 border">{new Date(order.startDate).toLocaleDateString()}</td>
                                        <td className="py-2 px-4 border">{daysDelivered} / {order.category.days}</td>
                                        <td className="py-2 px-4 border">{`${number} ${address}, ${landmark}, ${pincode}`}</td>
                                        <td className="py-2 px-4 border">{assignedTo}</td>
                                        <td className="py-2 px-4 border">{order.status}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
