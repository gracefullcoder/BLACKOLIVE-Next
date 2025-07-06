"use client";
import React, { useState, useEffect } from "react";
import { getAllMembership, getFilteredMemberships } from "@/src/actions/Order";
import OrderGrid from "@/src/components/adminorders/manage/OrderGrid";
import { useSession } from "next-auth/react";
import { deliveryUsers } from "@/src/actions/User";
import PreLoader from "../../PreLoader";
import { applyFilters, FilterOptionsType, getTodayItem, intialFilterOptions, mapProducts } from "@/src/utility/MembershipUtils/MembershipUtility";
import MembershipProductMap from "./MembershipProductMap";
import MessagedOrder from "./MessagedOrder";
import OrderMap from "./OrderMap";
import MembershipFilters from "./MembershipFilters";

export default function MemebershipDashBoard({ onlyActive, onlyAssigned }: any) {
  const session = useSession();
  const [memberships, setMemberships] = useState<any>([]);
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [membershipItems, setMembershipItems] = useState(new Map());
  const [productItems, setProductsItems] = useState(new Map());
  const [isActive, setIsActive] = useState(false);
  const [users, setUsers] = useState([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptionsType>({ ...intialFilterOptions, onlyAssigned: onlyAssigned || false });
  const [forTommorow, setForTommorow] = useState(false);

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
          await fetchFilteredMemberships();
        } else {
          await fetchAllMembership();
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    }

    fetchOrders();
  }, [onlyActive, forTommorow]);

  const fetchFilteredMemberships = async () => {
    try {
      setLoading(true);
      const status = ["delivered", "cancelled"];
      const slot = filterOptions.slot;
      const time = slot === "all" ? null : slot;
      let membershipData = await getFilteredMemberships(time, status, true, true, true,forTommorow);

      membershipData = membershipData.filter((membership: any) => {
        const deliveredDays = membership.deliveryDates.length;
        return deliveredDays !== membership.category.days;
      })

      let { mappedOrders, productMapping, membershipMapping } = mapProducts(membershipData);
      setOrders(mappedOrders);
      setProductsItems(productMapping);
      setMembershipItems(membershipMapping);
      setMemberships(membershipData);
    } catch (err) {
      console.error("Failed to fetch filtered orders", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMembership = async () => {
    try {
      setLoading(true);
      let membershipData = await getAllMembership();

      let { mappedOrders, productMapping, membershipMapping } = mapProducts(membershipData);
      console.log(mappedOrders);
      setOrders(mappedOrders);
      setProductsItems(productMapping);
      setMembershipItems(membershipMapping);
      setMemberships(membershipData);
    } catch (err) {
      console.error("Failed to fetch filtered orders", err);
    } finally {
      setLoading(false);
    }
  }

  const triggerFilter = (updatedFilterOptions: FilterOptionsType) => {
    const userId = session.data?.user?._id;
    const { mappedOrders, productMapping, membershipMapping } = applyFilters(memberships, updatedFilterOptions, userId);
    setOrders(mappedOrders);
    setProductsItems(productMapping);
    setMembershipItems(membershipMapping);
  }

  if (loading) return <PreLoader />;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Membership Management</h1>

        <div className="flex flex-wrap gap-2 mb-2 justify-between">
          <MembershipFilters
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
            isActive={isActive}
            triggerFilter={triggerFilter}
            setIsActive={setIsActive}
          />
          {onlyActive &&
            <div className="flex items-center gap-2 border p-4 h-fit rounded">
              <input
                type="checkbox"
                id="assigned"
                checked={forTommorow}
                name='forTommorow'
                onChange={(e: any) => setForTommorow((prev) => !prev)}
                className="h-4 w-4"
              />
              <label htmlFor="assigned">For Tommorow</label>
            </div>}
        </div>



        <OrderGrid
          title={""}
          orders={orders}
          setOrders={setOrders}
          setMemberships={setMemberships}
          setError={() => { }}
          session={session}
          isMembership={true}
          users={users}
        />
      </div>

      {/* Orders Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Orders Summary</h2>
        <OrderMap orderItems={membershipItems} />

        <h2 className="text-lg font-semibold my-2">Membership Products</h2>
        <MembershipProductMap productItems={productItems} />
        <MessagedOrder session={session} orders={orders} />
      </div>

    </div>
  );
}