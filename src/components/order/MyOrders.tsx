import React from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Star, Package, CreditCard } from 'lucide-react';

const MyOrders = ({ orders }: any) => {
    const router = useRouter();
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                    {orders?.orderDetails?.map((order: any) => (
                        <div
                            key={order._id}
                            onClick={() => router.push(`/order/${order._id}`)}
                            className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4"
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm text-gray-500">
                                            {formatDate(order.createdAt)}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <Clock size={14} />
                                            {order.time}:00
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
                    {orders?.membershipDetails?.map((membership: any) => (
                        <div
                            key={membership._id}
                            onClick={() => router.push(`/order/membership/?id=${membership._id}`)}
                            className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4"
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-gray-800 capitalize">
                                            {membership.category.title} Plan
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
                                            {membership.category.days} days
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div className="text-gray-600">
                                        Bonus Days: {membership.category.bonus}
                                    </div>
                                    <div className="text-gray-600">
                                        Used: {membership.bonusUsed}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Clock size={14} />
                                    Delivery at {membership.time}:00
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