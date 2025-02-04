import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import MembershipTable from './MembershipTable';
import { calculateProRatedRevenue, downloadMembershipExcel } from './analyticsFunctions';

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



    useEffect(() => {
        setFilteredMemberships(memberships);
        calculateAnalytics(memberships);
    }, [memberships]);

    return (
        <div className="space-y-6 p-4 max-sm:px-0">
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <h1 className="text-2xl font-bold">Membership Analytics</h1>
                <div className="flex gap-4 flex-wrap">
                    <div className="flex gap-4 flex-wrap">
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
                            onClick={() => downloadMembershipExcel(filteredMemberships)}
                            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export Excel
                        </button>
                    </div>
                </div>
            </div>

            <MembershipTable memberships={memberships} />

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
        </div>
    );
}