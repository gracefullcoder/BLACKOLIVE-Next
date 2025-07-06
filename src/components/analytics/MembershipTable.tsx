import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { downloadMembershipExcel, generateMembershipReceipt } from './analyticsFunctions';

const MembershipTable = ({ memberships }: any) => {
    const [filteredMemberships, setFilteredMemberships] = useState(memberships);
    const [statusFilter, setStatusFilter] = useState('all');
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const calculateTotal = (membership: any) => {
        const weeks = membership?.days / membership?.products?.length;
        const finalPrice: any = Math.round(membership?.products?.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * ((100 - membership?.discountPercent) / 100)) * weeks + (membership.extraCharge ? parseInt(membership.extraCharge) : 0);
        return finalPrice;
    };

    const handleStatusFilter = (status: any) => {
        if (status === 'all') {
            setFilteredMemberships(memberships);
        } else {
            setFilteredMemberships(memberships.filter((membership: any) => membership.status === status));
        }
        setStatusFilter(status);
        setIsSelectOpen(false);
    };

    const totalRevenue = filteredMemberships
        .filter((membership: any) => membership.status !== 'cancelled')
        .reduce((total: any, membership: any) => total + calculateTotal(membership), 0);

    const totalExtraCharges = filteredMemberships
        .filter((membership: any) => membership.status !== 'cancelled')
        .reduce((total: any, membership: any) => total + (membership.extraCharge ? parseInt(membership.extraCharge) : 0), 0);

    return (
        <div className="w-full bg-white rounded-lg shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Membership Details</h2>
                <div className="relative">
                    <div className='flex gap-2 flex-wrap max-sm:justify-center'>
                        <button
                            onClick={() => setIsSelectOpen(!isSelectOpen)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {statusFilter === 'all' ? 'All Memberships' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                        </button>

                        <button
                            onClick={() => downloadMembershipExcel(filteredMemberships)}
                            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export Excel
                        </button>
                    </div>

                    {isSelectOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                                {['all', 'delivered', 'cancelled', 'pending', 'assigned'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusFilter(status)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        {status === 'all' ? 'All Memberships' : status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600">Total Revenue</p>
                        <p className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">Total Extra Charges</p>
                        <p className="text-2xl font-bold">₹{totalExtraCharges.toFixed(2)}</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredMemberships.map((membership: any) => (
                                <tr key={membership._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {membership._id.slice(-6)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(membership.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{membership.user.name}</div>
                                        <div className="text-sm text-gray-500">{membership.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {membership.category.title}
                                            {membership.extraCharge > 0 && (
                                                <span className="text-blue-600 ml-1">(+₹{membership.extraCharge})</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {membership.deliveryDates.length} / {membership.category.days}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${membership.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                membership.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    membership.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'}`}>
                                            {membership.status.charAt(0).toUpperCase() + membership.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-2 text-left border">
                                        <p>{membership?.assignedTo?._id?.slice(-6) || ""}</p>
                                        <p>{membership?.assignedTo?.name || ""}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                        ₹{calculateTotal(membership)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <button
                                            onClick={() => generateMembershipReceipt(membership)}
                                            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                            title="Download Receipt"
                                        >
                                            <FileText className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MembershipTable;