import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Star, Package, CreditCard } from 'lucide-react';
import { formatTime } from '@/src/utility/timeUtil';
import { generateOrderReceipt } from '../analytics/analyticsFunctions';

const MyOrders = ({ orders,user }: any) => {
    const router = useRouter();

    // Pagination state for orders and memberships
    const PAGE_SIZE = 4;
    const [orderPage, setOrderPage] = useState(1);
    const [membershipPage, setMembershipPage] = useState(1);

    // Calculate paginated data
    const orderDetails = orders?.orderDetails || [];
    const membershipDetails = orders?.membershipDetails || [];
    const orderPageCount = Math.ceil(orderDetails.length / PAGE_SIZE);
    const membershipPageCount = Math.ceil(membershipDetails.length / PAGE_SIZE);
    const paginatedOrders = orderDetails.slice((orderPage - 1) * PAGE_SIZE, orderPage * PAGE_SIZE);
    const paginatedMemberships = membershipDetails.slice((membershipPage - 1) * PAGE_SIZE, membershipPage * PAGE_SIZE);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const daysRemaining = (startDate: string | Date, numOfDays: number): number => {
        const startDateFormat = new Date(startDate);
        const currDate = new Date()
        startDateFormat.setHours(0, 0, 0, 0);
        currDate.setHours(0, 0, 0, 0);

        if (startDateFormat > currDate) {
            return numOfDays;
        } else {
            const daysDelivered = (currDate.getTime() - startDateFormat.getTime()) / (1000 * 60 * 60 * 24);


            const remDays = numOfDays - Math.floor(daysDelivered)

            return remDays > 0 ? remDays : 0;
        }
    };


    return (
        <div className="p-6 space-y-8">
            {/* Regular Orders Section */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Package className="text-blue-600" />
                    My Orders
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    {paginatedOrders.map((order: any) => (
                        <div
                            key={order._id}
                            // onClick={() => router.push(`/order/${order._id}`)}
                            className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4"
                            onClick={() => generateOrderReceipt({...order,user})}
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm text-gray-500">
                                            {formatDate(order.createdAt)}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Clock size={14} />
                                            {formatTime(order.time)}
                                        </div>
                                    </div>
                                    {order.overallRating > 0 && (
                                        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm">{order.overallRating}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    {order.orders.map((item: any) => (
                                        <div key={item._id} className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <p className="text-gray-800 font-medium">{item.product.title}</p>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="text-blue-600 font-medium">₹{item.product.finalPrice * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                    <MapPin size={16} className="mt-1 flex-shrink-0" />
                                    <div>
                                        <p>#{order.address.number}, {order.address.address}</p>
                                        <p>{order.address.landmark}</p>
                                        <p>PIN: {order.address.pincode}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination controls for orders */}
                {orderPageCount > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                            onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                            disabled={orderPage === 1}
                        >
                            Prev
                        </button>
                        {Array.from({ length: orderPageCount }, (_, i) => (
                            <button
                                key={i}
                                className={`px-3 py-1 rounded ${orderPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                                onClick={() => setOrderPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                            onClick={() => setOrderPage((p) => Math.min(orderPageCount, p + 1))}
                            disabled={orderPage === orderPageCount}
                        >
                            Next
                        </button>
                    </div>
                )}

                {!orders?.orderDetails?.length && (
                    <div className="text-center py-8 text-gray-500">
                        No orders found
                    </div>
                )}
            </div>

            {/* Memberships Section */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CreditCard className="text-blue-600" />
                    My Memberships
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    {paginatedMemberships.map((membership: any) => (
                        <div
                            key={membership._id}
                            onClick={() => router.push(`/order/membership/?id=${membership._id}`)}
                            className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4"
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-gray-800 capitalize">
                                            {membership.category.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar size={14} className="text-gray-500" />
                                            <span className="text-sm text-gray-600">
                                                Starts: {formatDate(membership.startDate)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 px-3 py-1 rounded-full">
                                        <p className="text-sm text-blue-600">
                                            {membership.category.days - membership.deliveryDates.length} Days Rem.
                                        </p>
                                    </div>
                                </div>

                                {/* <div className="flex justify-between items-center text-sm">
                                    <div className="text-gray-600">
                                        Bonus Days: {membership.category.bonus}
                                    </div>
                                    <div className="text-gray-600">
                                        Used: {membership.bonusUsed}
                                    </div>
                                </div> */}

                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Clock size={14} />
                                    Delivery at {formatTime(membership.time)}
                                </div>

                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                    <MapPin size={16} className="mt-1 flex-shrink-0" />
                                    <div>
                                        <p>#{membership.address.number}, {membership.address.address}</p>
                                        <p>{membership.address.landmark}</p>
                                        <p>PIN: {membership.address.pincode}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination controls for memberships */}
                {membershipPageCount > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                            onClick={() => setMembershipPage((p) => Math.max(1, p - 1))}
                            disabled={membershipPage === 1}
                        >
                            Prev
                        </button>
                        {Array.from({ length: membershipPageCount }, (_, i) => (
                            <button
                                key={i}
                                className={`px-3 py-1 rounded ${membershipPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                                onClick={() => setMembershipPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                            onClick={() => setMembershipPage((p) => Math.min(membershipPageCount, p + 1))}
                            disabled={membershipPage === membershipPageCount}
                        >
                            Next
                        </button>
                    </div>
                )}

                {!orders?.membershipDetails?.length && (
                    <div className="text-center py-8 text-gray-500">
                        No memberships found
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;