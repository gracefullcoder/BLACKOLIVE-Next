import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { formatTime } from '@/src/utility/basic';

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

    const calculateProRatedRevenue = (membership: any) => {
        if (membership.status !== 'cancelled') {
            return membership.category.finalPrice;
        }

        const deliveredDays = membership.deliveryDates.length;
        const totalDays = membership.category.days;
        const proRatedRevenue = (membership.category.finalPrice * deliveredDays) / totalDays;
        return proRatedRevenue;
    };

    const isActiveMembership = (membership: any) => {
        const today = new Date();
        const startDate = new Date(membership.startDate);
        const deliveredDays = membership.deliveryDates.length;
        const totalDays = membership.category.days;

        return (
            startDate <= today &&
            deliveredDays < totalDays &&
            membership.status !== 'cancelled'
        );
    };

    const applyFilters = () => {
        let filtered = memberships;

        if (startDate && endDate) {
            filtered = memberships.filter((membership: any) => {
                const membershipStartDate = new Date(membership.startDate);
                return membershipStartDate >= new Date(startDate) &&
                    membershipStartDate <= new Date(endDate);
            });
        }

        setFilteredMemberships(filtered);
        calculateAnalytics(filtered);
    };

    const calculateAnalytics = (filtered: any) => {
        const categoryCounts: any = {};
        let totalRevenue = 0;

        filtered.forEach((membership: any) => {
            if (isActiveMembership(membership)) {
                const category: any = membership.category.title;
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }

            totalRevenue += calculateProRatedRevenue(membership);
        });

        const activeCount = filtered.filter(isActiveMembership).length;

        const topCategories = Object.entries(categoryCounts)
            .map(([category, count]: any) => ({ category, count }))
            .sort((a, b) => b.count - a.count);

        setAnalytics({
            activeMembershipCounts: categoryCounts,
            totalActiveMemberships: activeCount,
            totalRevenue,
            topCategories,
        });
    };

    const downloadExcel = () => {
        let csv = 'Membership ID,Full Name,Email,Contact,Address,Category,Status,Assigned To,Start Date,Delivery Time,Note,Delivered Days,Total Days,Price,Extra Price,Final Revenue\n';
        let grandTotal = 0;

        filteredMemberships.forEach((membership: any) => {
            const deliveredDays = membership.deliveryDates.length;
            const totalDays = membership.category.days;
            const revenue = calculateProRatedRevenue(membership);
            const address = `${membership.address.number} ${membership.address.address}, ${membership.address.landmark}, ${membership.address.pincode}`;
            grandTotal += revenue;

            csv += `${membership._id},` +
                `${membership.user.name},` +
                `${membership.user.email},` +
                `${membership.contact},` +
                `"${address}",` +
                `${membership.category.title},` +
                `${membership.status},` +
                `${membership.assignedTo || "unassigned"},` +
                `${new Date(membership.startDate).toLocaleDateString()},` +
                `${formatTime(membership.time)},` +
                `${membership.message || ""},` +
                `${deliveredDays},` +
                `${totalDays},` +
                `${membership.category.finalPrice},` +
                `${membership.extraCharge || "0"},` +
                `${revenue.toFixed(2)}\n`;
        });

        csv += `,,,,,,,,,,,,,,Grand Total,${grandTotal.toFixed(2)}\n`;

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
    }, [memberships]);

    return (
        <div className="space-y-6 p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <h1 className="text-2xl font-bold">Membership Analytics</h1>
                <div className="flex gap-4 flex-wrap">
                    <div className="flex gap-4">
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
                    <div className="flex gap-4">
                        <button
                            onClick={applyFilters}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Apply Filter
                        </button>
                        <button
                            onClick={downloadExcel}
                            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export Excel
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded shadow">
                    <h2 className="text-lg font-bold">Active Memberships</h2>
                    <p className="text-2xl">{analytics.totalActiveMemberships}</p>
                    <p className="text-gray-500">Current active memberships</p>
                </div>

                <div className="p-4 border rounded shadow">
                    <h2 className="text-lg font-bold">Total Revenue</h2>
                    <p className="text-2xl">₹{analytics.totalRevenue.toFixed(2)}</p>
                    <p className="text-gray-500">Including pro-rated cancellations</p>
                </div>
            </div>

            <div className="p-4 border rounded shadow">
                <h2 className="text-lg font-bold">Active Memberships by Category</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="text-left p-2 border">Category</th>
                                <th className="text-left p-2 border">Active Count</th>
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

            <div>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Membership Details</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">Category</th>
                                <th className="py-2 px-4 border">Start Date</th>
                                <th className="py-2 px-4 border">Progress</th>
                                <th className="py-2 px-4 border">Status</th>
                                <th className="py-2 px-4 border">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMemberships.map((membership: any) => (
                                <tr key={membership._id}>
                                    <td className="py-2 px-4 border">{membership.category.title}</td>
                                    <td className="py-2 px-4 border">
                                        {new Date(membership.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4 border">
                                        {membership.deliveryDates.length} / {membership.category.days}
                                    </td>
                                    <td className="py-2 px-4 border">
                                        <span className={`px-2 py-1 rounded ${isActiveMembership(membership)
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {membership.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border">
                                        ₹{calculateProRatedRevenue(membership).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}