"use client"
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Package, CreditCard, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { postponeMembership, postponeMembershipByDate, useBonus } from '@/src/actions/Order';
import { toast } from 'react-toastify';
import { formatTime } from '@/src/utility/timeUtil';
import { calculatePrices } from '@/src/utility/MembershipUtils/MembershipUtility';

const MembershipDetailsPage = ({ membership }: any) => {
    const router = useRouter();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    console.log(membership)

    // const postponeStatus = () => {
    //     try {
    //         if (!membership || !Array.isArray(membership.postponedDates)) {
    //             return false;
    //         }

    //         const utcDate = new Date();
    //         utcDate.setUTCHours(0, 0, 0, 0);
    //         utcDate.setDate(utcDate.getDate() + 1);

    //         console.log(utcDate.toISOString(), membership.startDate)
    //         if (new Date(membership.startDate) > utcDate) {
    //             return true;
    //         }

    //         const targetDateISO = utcDate.toISOString();
    //         const isDatePostponed = membership.postponedDates.some((date: any) => {
    //             const dateISO = new Date(date).toISOString();
    //             return dateISO === targetDateISO;
    //         });

    //         return isDatePostponed;
    //     } catch (error) {
    //         console.error("Error in postponeStatus:", error);
    //         return false;
    //     }
    // };


    // const [isPostpone, setPostpone] = useState(postponeStatus());
    const [selectedDate, setSelectedDate] = useState(null);

    const handlePostpone = async () => {
        if (!selectedDate) {
            toast.error("Select Date");
            return;
        }

        const confirmPostpone = window.confirm(
            `Are you sure you want to postpone to ${selectedDate}?`
        );

        if (!confirmPostpone) return;

        const date = new Date(selectedDate);
        date.setUTCHours(0, 0, 0, 0);

        if (membership.postponedDates.some((prev: any) => prev == date.toISOString())) { toast.error("Already Postponed Date"); return; }

        try {
            const res = await postponeMembershipByDate(membership._id, selectedDate);
            if (res.success) {
                toast.success(res.message);
                membership.postponedDates = membership.postponedDates
                    ? [...membership.postponedDates, date]
                    : [date];

                setSelectedDate(null);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Failed to postpone");
            console.error(error);
        }
    };

    const { price, finalPrice } = calculatePrices(membership?.products, membership?.discountPercent, membership?.days);


    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
                >
                    <ChevronLeft size={20} />
                    <span>Back to Orders</span>
                </button>

                <div className="bg-white shadow rounded-lg">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <CreditCard size={24} />
                            <h1 className="text-2xl font-bold capitalize">
                                {membership?.category?.title} Membership
                            </h1>
                        </div>
                        <p className="text-blue-100">
                            Order ID: {membership?._id}
                        </p>
                    </div>

                    {/* Membership Details */}
                    <div className="p-6 space-y-6">
                        {/* Plan Details */}
                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Plan Details</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Start Date</p>
                                        <p className="font-medium">
                                            {formatDate(membership?.startDate)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Package className="text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Duration</p>
                                        <p className="font-medium">
                                            {membership?.category?.days} Days
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Schedule */}
                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Schedule</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Daily Delivery Time</p>
                                        <p className="font-medium">{formatTime(membership?.time)}</p>
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-800 mb-2">Available Timings</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {membership?.category?.timings.map((time: number) => (
                                            <span
                                                key={time}
                                                className={`px-3 py-1 rounded-full text-sm
                                                    ${time === membership?.time
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-gray-600 border'}`}
                                            >
                                                {time}:00
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800 mb-2">Delivery Dates</h3>
                                    <div className='flex gap-4 flex-wrap'>
                                        {membership?.deliveryDates?.map((date: any, idx: any) => {
                                            return <div key={idx}>
                                                <div className='p-2 border-black border rounded-lg bg-green-300'>
                                                    {
                                                        formatDate(date)
                                                    }
                                                </div>
                                            </div>
                                        })}
                                    </div>

                                    <h3 className="font-medium text-gray-800 mt-4 mb-2">Postponed Dates</h3>
                                    <div className='flex gap-4 flex-wrap'>
                                        {membership?.postponedDates?.map((date: any, idx: any) => {
                                            return <div key={idx}>
                                                <div className='p-2 border-black border rounded-lg bg-yellow-300'>
                                                    {
                                                        formatDate(date)
                                                    }
                                                </div>
                                            </div>
                                        })}
                                    </div>

                                    {/* {!isPostpone ||  */}
                                    <div className='mt-8 gap-4 flex items-center border-t pt-4 flex-wrap'>
                                        <h3 className='font-medium text-gray-800 text-xl'>Postpone Specific Date</h3>
                                        <div className='flex gap-4'>
                                            <input type="date" className='border border-black p-2 rounded-md' onChange={(e: any) => { setSelectedDate(e.target.value) }} min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} />
                                            <button className='border bg-red-300 p-2 rounded' onClick={handlePostpone}>Postpone</button>
                                        </div>
                                    </div>
                                    {/* } */}
                                </div>
                            </div>
                        </div>

                        {/* Bonus Days */}
                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Days Overview</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Postponed Days</p>
                                        <p className="text-xl font-semibold text-blue-600">
                                            {membership?.postponedDates?.length}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Remaining Days</p>
                                        <p className="text-xl font-semibold text-gray-800">
                                            {membership?.category?.days - (membership?.deliveryDates?.length || 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Address</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-blue-600 mt-1" />
                                    <div>
                                        <p className="text-gray-800">
                                            #{membership?.address?.number}, {membership?.address?.address}
                                        </p>
                                        {membership?.address?.landmark && (
                                            <p className="text-gray-600">
                                                Landmark: {membership?.address?.landmark}
                                            </p>
                                        )}
                                        <p className="text-gray-600">
                                            PIN: {membership?.address?.pincode}
                                        </p>
                                        <p className="text-gray-600">
                                            Contact: {membership?.contact}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="mt-6 pt-6 border-t">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-800">Total Amount</h2>
                                <p className="text-2xl font-bold text-blue-600">
                                    ₹{finalPrice}
                                </p>
                            </div>
                            {price && (
                                <p className="text-gray-500 text-sm text-right mt-1">
                                    Original Price: <span className="line-through">₹{price}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MembershipDetailsPage;