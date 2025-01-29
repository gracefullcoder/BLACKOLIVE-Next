import React from 'react';
import Link from 'next/link';

function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">

      <div className="text-2xl font-semibold text-gray-800 mb-8">Admin Dashboard</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        <Link
          href="/admin/orders"
          className="p-6 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition"
        >
          <div className="text-lg font-medium text-gray-700">Manage Orders</div>
        </Link>
        <Link
          href="/admin/membership"
          className="p-6 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition"
        >
          <div className="text-lg font-medium text-gray-700">Manage Membership</div>
        </Link>
        <Link
          href="/admin/users"
          className="p-6 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition"
        >
          <div className="text-lg font-medium text-gray-700">Users</div>
        </Link>
        <Link
          href="/admin/products"
          className="p-6 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition"
        >
          <div className="text-lg font-medium text-gray-700">Products</div>
        </Link>
        <Link
          href="/admin/products/add"
          className="p-6 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition"
        >
          <div className="text-lg font-medium text-gray-700">Add New Product</div>
        </Link>
        <Link
          href="/admin/features"
          className="p-6 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition"
        >
          <div className="text-lg font-medium text-gray-700">Extra Features</div>
        </Link>
        <Link
          href="/admin/create"
          className="p-6 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition"
        >
          <div className="text-lg font-medium text-gray-700">Create Order & Membership</div>
        </Link>
        <Link
          href="/admin/features/pincodes"
          className="p-6 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition"
        >
          <div className="text-lg font-medium text-gray-700">Manage Pincodes</div>
        </Link>
        <Link
          href="/admin/features/timings"
          className="p-6 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition"
        >
          <div className="text-lg font-medium text-gray-700">Manage Timings</div>
        </Link>
      </div>
    </div>
  );
}

export default Page;
