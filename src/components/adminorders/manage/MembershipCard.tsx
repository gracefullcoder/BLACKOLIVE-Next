import {
    addExtraCharge,
    updateMembershipStatus,
    updatePaymentStatus
} from '@/src/actions/Order';
import { toast } from 'react-toastify';
import { AssignedDetails, OrderButtons, ShowMessage, UserBasicDetails } from './OrderBasicDetails';
import SelectDeliveryUser from './SelectDeliveryUser';

function MembershipCard({ order, setOrders, setError, session, users }: any) {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const handleStatusUpdate = async (orderId: any, newStatus: any) => {
        try {
            const updatedOrder = await updateMembershipStatus(orderId, newStatus);
            if (updatedOrder?.success) {
                setOrders((prev: any) => (prev.map((order: any) =>
                    order._id === orderId ? updatedOrder.product : order
                )));
                toast.success(updatedOrder.message);
            } else {
                toast(updatedOrder?.message)
            }

        } catch (err) {
            setError('Failed to update order status');
            console.error(err);
        }
    };

    const handlePaymentStatus = async () => {
        try {
            const res = await updatePaymentStatus(order._id, !order?.isPaid, true);

            if (res.success) {
                setOrders((prev: any) => (prev.map((prevOrder: any) => (prevOrder._id === order._id ? { ...prevOrder, isPaid: !prevOrder.isPaid } : prevOrder))));
                toast.success(res?.message)
            } else {
                toast.error(res?.message)
            }
        } catch (error) {
            console.log(error || "Internal server error")
        }
    }

    const handleExtraCharges = async (e: any, orderId: any, productId: any, extraCharge: any) => {
        e.preventDefault();
        try {
            console.log(extraCharge)
            const res = await addExtraCharge(orderId, productId, extraCharge);
            if (res.success) {
                setOrders((prev: any) => (prev.map((order: any) =>
                    order._id === orderId ? { ...order, extraCharge } : order
                )));
                toast.success(res.message)
            }
            setError('');
        } catch (err) {
            setError('Failed to update quantity');
            console.error(err);
        }
    }

    return (
        <div key={order._id} className="border rounded-lg p-4 bg-white shadow">

            <UserBasicDetails order={order} />

            <div className="py-2 border-t flex flex-col gap-1">
                <p>Membership Type : {order.category.title}</p>
                <p>Start Date : {order.startDate.toString().slice(0, 10)}</p>
                <p>Total Days Delivered : <span className='font-bold'>{order?.deliveryDates?.length || 0}</span></p>

                <div className='flex justify-between items-center'>
                    <p>
                        Price : {!order.extraCharge ? `${order.category.finalPrice} /-` : `${order.category.finalPrice} + ${order.extraCharge} = ${parseInt(order.category.finalPrice) + parseInt(order.extraCharge)} /-`}
                    </p>
                    <div className='flex items-center gap-2'>
                        Paid: <input type="checkbox" className='h-4 w-4' checked={order?.isPaid || false} onChange={handlePaymentStatus} />
                    </div>
                </div>
                <div className='flex justify-between items-center'>
                    <p>
                        Extra Charges : {order?.extraCharge || "No"}
                    </p>
                    <form
                        className="flex"
                        onSubmit={(e: any) => handleExtraCharges(e, order._id, false, parseInt(e.target.extraCharges.value))}
                    >
                        <input
                            type="text"
                            name="extraCharges"
                            className="border rounded w-20 p-1 mr-2"
                            placeholder="Add extra"
                            required
                        />
                        <button className='p-1 bg-green-300 rounded-md'>Update</button>
                    </form>
                </div>

                <AssignedDetails order={order} />
            </div>

            <div>
                <h3 className="font-medium text-gray-800 mb-2">Delivery Dates</h3>
                <div className='flex gap-4 flex-wrap'>
                    {order?.deliveryDates?.map((date: any, idx: any) => {
                        return <div key={idx}>
                            <div className='p-2 border-black border rounded-lg bg-green-300'>
                                {
                                    formatDate(date)
                                }
                            </div>
                        </div>
                    })}
                </div>

                <h3 className="font-medium text-gray-800 mt-4 mb-2">Postponed Dates</h3>
                <div className='flex gap-4 flex-wrap'>
                    {order?.postponedDates?.map((date: any, idx: any) => {
                        return <div key={idx}>
                            <div className='p-2 border-black border rounded-lg bg-yellow-300'>
                                {
                                    formatDate(date)
                                }
                            </div>
                        </div>
                    })}
                </div>

            </div>

            <ShowMessage message={order.message} />
            <OrderButtons session={session} order={order} setOrders={setOrders} setError={setError} isMembership={true} />
            {session?.data.user?.isAdmin && <SelectDeliveryUser users={users} orderId={order._id} isMembership={true} setOrders={setOrders} setError={setError} />}
        </div >
    )
}

export default MembershipCard