"use client"
import React, { useEffect, useState } from 'react';
import { X, Calendar, ChevronDown } from 'lucide-react';

const MembershipPlanner = ({ isModalOpen, setIsModalOpen, membershipData, weeklyPlan, setWeeklyPlan, daysOfWeek }: any) => {

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [modifiedPlan, setModifiedPlan] = useState({ ...weeklyPlan });
  const [priceDetails, setPriceDetails] = useState({ price: 0, finalPrice: 0 });
  console.log("apple", membershipData)

  useEffect(() => {
    let { price, finalPrice } = calculatePrices(Object.values(modifiedPlan), membershipData.discountPercent, membershipData.days);
    setPriceDetails({ price, finalPrice });
  }, [modifiedPlan])

  const handleProductSelection = (day: any, product: any) => {
    setModifiedPlan((prev: any) => ({
      ...prev,
      [day]: product
    }));
    setActiveDropdown(null);
  };

  const savePlan = () => {
    setWeeklyPlan(modifiedPlan);
  }

  const toggleDropdown = (day: any) => {
    setActiveDropdown(activeDropdown === day ? null : day);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveDropdown(null);
  };

  const weeks = membershipData.days / membershipData.products.length;

  const calculatePrices = (products: any, discountPercent: any, days: any) => {
    const weeks = days / products?.length;
    const price = products.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * weeks;
    const finalPrice = Math.round(products.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * ((100 - discountPercent) / 100)) * weeks;
    return { price, finalPrice };
  }

  return (
    <div className="p-6">

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="flex justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Weekly Membership Planner</h2>
                  <p className="text-green-100">{membershipData.details}</p>

                  <div className="mt-2 text-sm text-green-100">
                    Weekly Plan for {weeks} {weeks > 1 ? "Weeks" : "week"}
                  </div>

                  <p className="text-green-100">
                    In <span className="font-semibold">{membershipData.title}</span> you get an extra discount of{" "}
                    <span className="font-semibold">{membershipData.discountPercent}%</span> on product selling price.
                  </p>
                </div>

                {/* <div className="bg-white rounded-xl shadow p-4 text-sm text-gray-700 w-64 ml-auto">
                  <h3 className="text-base font-semibold text-green-600 mb-3">Billing Summary</h3>

                  <div className="flex justify-between py-1">
                    <span>Total Price</span>
                    <span className="font-medium text-gray-900">₹{priceDetails.price}.00</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span>Discount ({membershipData.discountPercent}%)</span>
                    <span className="font-medium text-red-600">
                      – ₹{priceDetails.price - priceDetails.finalPrice}.00
                    </span>
                  </div>

                  <div className="border-t border-gray-200 my-2"></div>

                  <div className="flex justify-between py-1 text-base font-semibold text-green-700">
                    <span>To Pay</span>
                    <span>₹{priceDetails.finalPrice}.00</span>
                  </div>
                </div> */}
              </div>

            </div>


            {/* Content */}
            <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
              <div className="grid gap-4">
                {daysOfWeek?.map((day: any, index: number) => (
                  <div key={day} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <h3 className="font-semibold text-lg text-gray-800">{day}</h3>
                      </div>
                    </div>

                    {/* Selected Product Display */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={modifiedPlan[day].image}
                          alt={modifiedPlan[day].title}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e: any) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{modifiedPlan[day].title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{modifiedPlan[day].details}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-semibold text-green-600">₹{modifiedPlan[day].finalPrice}</span>
                            <span className="text-sm text-gray-500 line-through">₹{modifiedPlan[day].price}</span>
                            {modifiedPlan[day].speciality && (
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                                {modifiedPlan[day].speciality}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown for Product Selection */}
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(day)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-700">Change selection</span>
                        <ChevronDown
                          size={20}
                          className={`text-gray-400 transition-transform ${activeDropdown === day ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {activeDropdown === day && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                          {membershipData.products.map((product: any) => (
                            <button
                              key={product._id}
                              onClick={() => handleProductSelection(day, product)}
                              className={`w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${modifiedPlan[day]._id === product._id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                  onError={(e: any) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNkgzMlYzMkgxNlYxNloiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
                                  }}
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 text-sm">{product.title}</h5>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm font-semibold text-green-600">₹{product.finalPrice}</span>
                                    <span className="text-xs text-gray-500 line-through">₹{product.price}</span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="self-start bg-white rounded-xl shadow mt-4 p-4 text-sm text-gray-700 w-full">
                <h3 className="text-base font-semibold text-green-600 mb-3">Billing Summary</h3>

                <div className="flex justify-between py-1">
                  <span>Total Price</span>
                  <span className="font-medium text-gray-900">₹{priceDetails.price}.00</span>
                </div>

                <div className="flex justify-between py-1">
                  <span>Discount ({membershipData.discountPercent}%)</span>
                  <span className="font-medium text-red-600">
                    - ₹{priceDetails.price - priceDetails.finalPrice}.00
                  </span>
                </div>

                <div className="border-t border-gray-200 my-2"></div>

                <div className="flex justify-between py-1 text-base font-semibold text-green-700">
                  <span>To Pay</span>
                  <span>₹{priceDetails.finalPrice}.00</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3 justify-end">
                <div className='flex gap-4 felx-wrap'>
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 border h-fit border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      savePlan();
                      console.log('Weekly plan saved:', modifiedPlan);
                      closeModal();
                    }}
                    className="px-6 py-2 h-fit bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    Save Weekly Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipPlanner;