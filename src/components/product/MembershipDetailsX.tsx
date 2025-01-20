"use client"
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Package, CreditCard, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBonus } from '@/src/actions/Order';
import { toast } from 'react-toastify';

const daysRemaining = (startDate: string | Date, numOfDays: number): number => {
    const startDateFormat = new Date(startDate);
    const currDate = new Date();

    if (startDateFormat > currDate) {
        return numOfDays;
    } else {
        const daysDelivered = (currDate.getTime() - startDateFormat.getTime()) / (1000 * 60 * 60 * 24);

        const remDays = numOfDays - Math.floor(daysDelivered)

        return remDays > 0 ? remDays : 0;
    }
};

const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

function getAheadDates(startDate: string, daysAhead: number, daysMapping: number[]) {
    const start = new Date(startDate);
    const currDate = new Date()
    const dates = [{
        data: start.getDate() + " " + monthName[start.getMonth()],
        bonus: currDate < start && daysMapping[0] ? true : false
    }];

    for (let i = 1; i < daysAhead; i++) {
        const nextDate = new Date(start);
        nextDate.setDate(start.getDate() + i);
        dates.push({
            data: nextDate.getDate() + " " + monthName[nextDate.getMonth()],
            bonus: (currDate < nextDate && daysMapping[i]) ? true : false
        });
    }

    return dates;
}

const MembershipDetailsPage = ({ membership }: any) => {
    const router = useRouter();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };


    const [graphDates, setGraphDates] = useState(getAheadDates(membership.startDate, membership.deliveryGraph.length, membership.deliveryGraph));

    const handleBonus = async (idx: number, orderId: string) => {
        const res: any = await useBonus(idx, orderId);
        if (res.success) {
            membership.bonusUsed++;
            setGraphDates((prev) => {
                const newData = [...prev]
                newData[idx].bonus = false
                newData[res.updatedIdx].bonus = true
                membership.deliveryGraph[idx] = 0;
                membership.deliveryGraph[res.updatedIdx] = 1;
                return newData
            })
            toast.success(res.message)
        } else {
            toast.error(res.message)
        }
    }
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
                                        <p className="font-medium">{membership?.time}:00</p>
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
                                    <h3 className="font-medium text-gray-800 mb-2">Delivery Graph</h3>
                                    <div className='flex gap-4 flex-wrap'>
                                        {membership.deliveryGraph.map((val: any, idx: any) => {
                                            return <div key={idx}>
                                                <div className={` p-2 border-black border rounded-lg
                                                ${val == 1 ? 'bg-green-300' : 'bg-yellow-300'}
                                                `} >{
                                                        graphDates[idx].data}
                                                </div>
                                                {(membership?.category?.bonus > membership.bonusUsed) && graphDates[idx].bonus && <button onClick={() => handleBonus(idx, membership._id)}>Use Bonus</button>}
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bonus Days */}
                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Bonus Days</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Bonus Days</p>
                                        <p className="text-xl font-semibold text-blue-600">
                                            {membership?.category?.bonus}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Used Bonus Days</p>
                                        <p className="text-xl font-semibold text-gray-800">
                                            {membership?.bonusUsed}
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
                                    ₹{membership?.category?.finalPrice}
                                </p>
                            </div>
                            {membership?.category?.price !== membership?.category?.finalPrice && (
                                <p className="text-gray-500 text-sm text-right mt-1">
                                    Original Price: <span className="line-through">₹{membership?.category?.price}</span>
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