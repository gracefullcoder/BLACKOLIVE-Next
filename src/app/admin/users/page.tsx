"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PreLoader from '@/src/components/PreLoader';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        console.log(data)
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAdminToggle = async (userId: any, isAdmin: any, isDelivery: any) => {
    try {
      const response: any = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAdmin, isDelivery }),
      });

      if (response.ok) {
        setUsers(users.map((user: any) =>
          user._id === userId
            ? { ...user, isAdmin, isDelivery }
            : user
        ));
      }
    } catch (error) {
      console.error('Error toggling admin status:', error);
    }
  };

  const handleViewDetails = (userId: any) => {
    router.push(`/admin/users/details?userId=${userId}`);
  };

  if (loading) <PreLoader />


  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Make Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user: any) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.profileImage && (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isAdmin || user.isDelivery ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {user?.isAdmin ? "Admin" : user.isDelivery ? "Delivery" : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className='flex justify-center'>
                      <input
                        type="checkbox"
                        checked={user.isAdmin}
                        onChange={() => handleAdminToggle(user._id, !user.isAdmin, user.isDelivery)}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap mx-auto">
                    <div className='flex justify-center'>
                      <input
                        type="checkbox"
                        checked={user.isDelivery}
                        onChange={() => handleAdminToggle(user._id, user.isAdmin, !user.isDelivery)}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap mx-auto">
                    <button
                      onClick={() => handleViewDetails(user._id)}
                      className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                    >
                      View Details
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
}
