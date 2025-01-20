"use client"
import React, { useState, useEffect } from 'react';
import { getAllMembership } from '@/src/actions/Order';
import MembershipAnalytics from '@/src/components/analytics/MembershipAnalytics';

export default function Page() {
    const [orders, setOrders] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getAllMembership();
            console.log(data)
            setOrders(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    return (
        <div className="p-4 max-w-7xl mx-auto">
            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

            <MembershipAnalytics memberships={orders} />
        </div>
    );
}