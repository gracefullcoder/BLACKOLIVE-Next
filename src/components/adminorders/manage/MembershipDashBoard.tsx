"use client";
import React, { useState, useEffect } from "react";
import { getAllMembership, getFilteredMemberships } from "@/src/actions/Order";
import OrderGrid from "@/src/components/adminorders/manage/OrderGrid";
import { useSession } from "next-auth/react";
import { deliveryUsers } from "@/src/actions/User";
import PreLoader from "../../PreLoader";

export default function MemebershipDashBoard({ onlyAssigned, onlyActive }: any) {
  const session = useSession();
  const [memberships, setMemberships] = useState<any>([]);
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [membershipItems, setMembershipItems] = useState(new Map());
  const [productItems, setProductsItems] = useState(new Map());
  const [isActive, setIsActive] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const res = await deliveryUsers();
      if (res.success) {
        setUsers(res?.users);
      }
    }
    getUsers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (onlyActive) {
          await fetchFilteredOrders();
        } else {
          await fetchAllMembership();
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    }

    fetchOrders();
  }, [onlyActive]);

  const applyFilters = (data: any) => {
    let filtered = [...data];

    if (startDate || endDate) {
      filtered = filtered.filter((membership: any) => {
        const membershipDate = new Date(membership.startDate);
        if (startDate && endDate) {
          return membershipDate >= new Date(startDate) && membershipDate <= new Date(endDate);
        } else if (startDate) {
          return membershipDate >= new Date(startDate);
        } else if (endDate) {
          return membershipDate <= new Date(endDate);
        }
        return true;
      });
    }

    // Apply email search filter
    if (search) {
      filtered = memberships.filter((membership: any) =>
        membership?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        membership?.user.email.toLowerCase().includes(search.toLowerCase()) ||
        membership?.contact?.toString().includes(search) ||
        membership?.adminOrder?.customerName?.toString().includes(search)
      );
    }else{

    }

    // Apply time filter
    if (timeFilter !== "all") {
      filtered = filtered.filter((membership: any) => {
        const time = parseInt(membership.time);
        switch (timeFilter) {
          case 'morning':
            return time >= 0 && time < 12;
          case 'afternoon':
            return time >= 12 && time < 15;
          case 'evening':
            return time >= 15 && time < 17;
          case 'night':
            return time >= 17 && time < 24;
          default:
            return true;
        }
      });
    }

    // Apply active/assigned filter
    if (onlyAssigned || isActive) {
      filtered = filtered.filter((order: any) => order.assignedTo?._id == session.data?.user?._id);
    }

    // Filter out completed memberships
    filtered = filtered.filter((membership: any) => {
      const deliveredDays = membership.deliveryDates.length;
      return deliveredDays !== membership.category.days;
    });

    mapProducts(filtered);
  };

  useEffect(() => {
    applyFilters(memberships);
  }, [timeFilter, startDate, endDate, search, isActive, session.data?.user?._id]);

  const mapProducts = (data: any) => {
    const productMapping = new Map();
    const membershipMapping = new Map();

    let mappedOrders = data.map((membership: any) => {
      const deliveredDays = membership.deliveryDates.length;
      const currentProduct = membership.products[deliveredDays % membership.products.length].product;
      const { price, finalPrice } = calculatePrices(membership.products, membership.discountPercent, membership.days);

      let membershipId = membership.category._id;
      if (membershipMapping.has(membershipId)) {
        const prodDet = membershipMapping.get(membershipId);
        membershipMapping.set(membershipId, {
          ...prodDet,
          quantity: (prodDet?.quantity || 0) + 1,
        });
      } else {
        membershipMapping.set(membershipId, {
          quantity: 1,
          name: membership.category.title
        });
      }

      let productId = currentProduct._id;

      if (productMapping.has(productId)) {
        const prodDet = productMapping.get(productId);
        productMapping.set(productId, {
          ...prodDet,
          quantity: (prodDet?.quantity || 0) + 1,
        });
      } else {
        productMapping.set(productId, {
          quantity: 1,
          name: currentProduct.title
        });
      }

      return {
        ...membership,
        currentProduct,
        price,
        finalPrice
      };
    });

    setMembershipItems(membershipMapping);
    setProductsItems(productMapping);
    setOrders(mappedOrders);
  };

  const calculatePrices = (products: any, discountPercent: any, days: any) => {
    const weeks = days / products.length;
    const price = products.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * weeks;
    const finalPrice = Math.round(products.reduce((sum: any, curr: any) => (sum + curr.finalPrice), 0) * ((100 - discountPercent) / 100)) * weeks;
    return { price, finalPrice };
  }

  const fetchFilteredOrders = async () => {
    try {
      setLoading(true);
      const status = ["delivered", "cancelled"];
      const time = timeFilter === "all" ? null : timeFilter;
      let data = await getFilteredMemberships(time, status, true, true, true);

      data = data
        .filter((membership: any) => {
          const deliveredDays = membership.deliveryDates.length;
          return deliveredDays !== membership.category.days;
        })

      console.log("in", data)
      if (onlyAssigned || isActive) {
        console.log("insidne active memebership")
        const myMemberships = data.filter((order: any) => order.assignedTo?._id == session.data?.user?._id)
        mapProducts(myMemberships);
        setMemberships(myMemberships);
      } else {
        mapProducts(data);
        setMemberships(data);
      }
    } catch (err) {
      console.error("Failed to fetch filtered orders", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMembership = async () => {
    try {
      setLoading(true);
      let data = await getAllMembership();
      mapProducts(data);
    } catch (err) {
      console.error("Failed to fetch filtered orders", err);
    } finally {
      setLoading(false);
    }
  }


  if (loading) return <PreLoader />;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Membership Management</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-4">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="all">All Times</option>
              <option value="morning">Slot-1 (6AM-11AM)</option>
              <option value="afternoon">Slot-2 (11AM-2PM)</option>
              <option value="evening">Slot-3 (2PM-5PM)</option>
              <option value="night">Slot-4 (5PM-12AM)</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded"
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* Email Search */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search by email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {!onlyAssigned && <div className="flex items-center gap-2 border p-4 rounded">
            <input
              type="checkbox"
              id="assigned"
              checked={isActive}
              onChange={() => setIsActive((prev) => !prev)}
              className="h-4 w-4"
            />
            <label htmlFor="assigned">Assigned to me</label>
          </div>}
        </div>

        <OrderGrid
          title={""}
          orders={orders}
          setOrders={setOrders}
          setError={() => { }}
          session={session}
          isMembership={true}
          users={users}
        />
      </div>

      {/* Orders Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Orders Summary</h2>

        {/* Membership Type */}
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Product Name</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {[...membershipItems.keys()].map((key) => (
              <tr key={key}>
                <td className="border border-gray-300 px-4 py-2">
                  {membershipItems.get(key)?.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {membershipItems.get(key)?.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Products */}
        <h2 className="text-lg font-semibold my-2">Membership Products</h2>


        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Product Name</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {[...productItems.keys()].map((key) => (
              <tr key={key}>
                <td className="border border-gray-300 px-4 py-2">
                  {productItems.get(key)?.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {productItems.get(key)?.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>




        {/* Messaged Orders */}
        <div className="my-6">
          <h2 className="text-lg font-semibold mb-2">Messaged Orders</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border-2 border-black px-4 py-2">Order Details</th>
                <th className="border-2 border-black px-4 py-2">Product Name</th>
                <th className="border-2 border-black px-4 py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {orders.filter((order: any) => order.message).map((orderDet: any, idx: any) =>
              (<tr key={`${orderDet._id}-${idx}`}>

                <td className='border border-gray-300 px-4 py-2'>
                  <p>Id: {orderDet._id}</p>
                  <p>Name: {orderDet.user.name}</p>
                  <span>Address:</span> {orderDet.address.address}, {orderDet.address.landmark}, {orderDet.address.pincode}
                  <p>
                    <span className="font-bold">{orderDet?.assignedTo?._id == session.data?.user?._id ? "Assigned To Me " : "Assigned To"}</span>
                    {orderDet.assignedTo ? <span className="font-bold text-green-500"> {orderDet?.assignedTo?.name}</span> : <span className="font-bold text-red-500">None</span>}
                  </p>

                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <p>{orderDet.category.title}</p>
                </td>

                <td className="border border-gray-300 px-4 py-2">
                  <p className="text-red-500">{orderDet.message}</p>
                </td>

              </tr>)
              )}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}