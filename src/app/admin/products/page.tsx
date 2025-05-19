"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProducts } from "@/src/actions/Product";
import PreLoader from "@/src/components/PreLoader";

export default function ProductManagementPage() {
  const [allProducts, setAllProducts] = useState<any>({ products: [], membership: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts("all");

        setAllProducts(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle availability toggle
  const handleAvailabilityToggle = async (productId: any, currentStatus: any, isMembership: boolean) => {
    try {
      const response: any = await fetch(`/api/admin/products`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAvailable: !currentStatus, productId, isMembership }),
      });

      if (response.ok) {
        setAllProducts((prev: any) => {
          if (isMembership) {
            return {
              membership: prev.membership.map((product: any) =>
                product._id === productId
                  ? { ...product, isAvailable: !product.isAvailable }
                  : product
              ),
              products: [...prev.products]
            }
          }
          else {
            return {
              membership: [...prev.membership],
              products: prev.products.map((product: any) =>
                product._id === productId
                  ? { ...product, isAvailable: !product.isAvailable }
                  : product
              )
            }
          }
        });
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  };

  // Navigate to product details
  const handleViewDetails = (productId: any, isMembership: boolean) => {
    !isMembership ? router.push(`/admin/products/edit/?id=${productId}`) :
      router.push(`/admin/products/edit/?Mid=${productId}`)
  };

  const calculatePrices = (memProductIds: any, discountPercent: any) => {
    const membershipProducts = allProducts.products.filter((p: any) => (memProductIds.includes(p?._id)));
    const price = membershipProducts.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0);
    const finalPrice = Math.round(membershipProducts.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * ((100 - discountPercent) / 100));
    return { price, finalPrice };
  }

  if (loading) <PreLoader />


  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h1 className="text-2xl font-bold mb-6">Product Management</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Speciality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allProducts.products.map((product: any) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.speciality}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.price.toFixed(2)} /-
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {product.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={product.isAvailable}
                      onChange={() =>
                        handleAvailabilityToggle(product._id, product.isAvailable, false)
                      }
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(product._id, false)}
                      className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Speciality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bonus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allProducts.membership.map((product: any) => {
                let { price, finalPrice } = calculatePrices(product.products,product.discountPercent);

                return (<tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.speciality}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {finalPrice.toFixed(2)} /-
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {product.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.days}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.bonus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.timings.toString()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={product.isAvailable}
                      onChange={() =>
                        handleAvailabilityToggle(product._id, product.isAvailable, true)
                      }
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(product._id, true)}
                      className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                    >
                      View Details
                    </button>
                  </td>
                </tr>)
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
