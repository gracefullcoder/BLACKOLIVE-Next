import React from 'react'
import OrderCard from "@/src/components/adminorders/manage/OrderCard"
import MembershipCard from './MembershipCard'
function OrderGrid({ title, orders, setOrders, setError, session, isMembership }: any) {
    return (
        <div>
            <h1>{title}</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {orders.map((order: any) => (<div key={order._id}>
                    {
                        isMembership ?
                            <MembershipCard order={order} setOrders={setOrders} setError={setError} session={session} />
                            :
                            <OrderCard order={order} setOrders={setOrders} setError={setError} session={session} />
                    }
                </div>))}
            </div>
        </div>
    )
}

export default OrderGrid