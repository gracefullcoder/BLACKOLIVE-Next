"use client"
import React from 'react'
import Link from 'next/link'
function page() {
    return (
        <div>

            <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">

                <div className="text-2xl font-semibold text-gray-800 mb-8">Admin Dashboard</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
                    <Link
                        href="/admin/membership/active"
                        className="p-6 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition"
                    >
                        <div className="text-lg font-medium text-gray-700">Active Membership</div>
                    </Link>
                    <Link
                        href="/admin/membership/analytics"
                        className="p-6 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition"
                    >
                        <div className="text-lg font-medium text-gray-700">Membership Analytics</div>
                    </Link>

                </div>
            </div>
        </div>
    )
}

export default page