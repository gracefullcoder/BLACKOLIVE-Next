import {
    addExtraCharge,
    postponeMembershipByDate,
    updateMembershipStatus,
    updatePaymentStatus
} from '@/src/actions/Order';
import { toast } from 'react-toastify';
import { AssignedDetails, OrderButtons, ShowMessage, UserBasicDetails } from './OrderBasicDetails';
import SelectDeliveryUser from './SelectDeliveryUser';

function MembershipCard({ order, setOrders, setError, session, users,setMemberships }: any) {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const handlePaymentStatus = async () => {
        try {
            const res = await updatePaymentStatus(order._id, !order?.isPaid, true);

            if (res.success) {
                setOrders((prev: any) => (prev.map((prevOrder: any) => (prevOrder._id === order._id ? { ...prevOrder, isPaid: !prevOrder.isPaid } : prevOrder))));
                setMemberships((prev: any) => (prev.map((prevOrder: any) => (prevOrder._id === order._id ? { ...prevOrder, isPaid: !prevOrder.isPaid } : prevOrder))));

                toast.success(res?.message)
            } else {
                toast.error(res?.message)
            }
        } catch (error) {
            console.log(error || "Internal server error")
        }
    }

    const handlePostpone = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const postponeDate = formData.get("postponeDate");

        if (postponeDate) {
            const res = await postponeMembershipByDate(order._id, postponeDate);

            if (res?.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        } else {
            toast.error("Enter a valid Date!");
        }
    };

    const handleExtraCharges = async (e: any, orderId: any, productId: any, extraCharge: any) => {
        e.preventDefault();
        try {
            console.log(extraCharge)
            const res = await addExtraCharge(orderId, productId, extraCharge);
            if (res.success) {
                setOrders((prev: any) => (prev.map((order: any) =>
                    order._id === orderId ? { ...order, extraCharge } : order
                )));
                setMemberships((prev: any) => (prev.map((order: any) =>
                    order._id === orderId ? { ...order, extraCharge } : order
                )));
                console.log(res);
                toast.success(res.message)
            }
            setError('');
        } catch (err) {
            setError('Failed to update quantity');
            console.error(err);
        }
    }

    return (
        <div key={order._id} className={`border rounded-lg p-4 shadow`}>

            <UserBasicDetails order={order} />

            {order?.paymentId && (
                <p className='pt-1 border-t border-t-black border-solid'>
                    PaymentId : {order.paymentId}
                </p>
            )}

            <div className="py-2 border-t flex flex-col gap-1">
                <p>Membership Type : {order.category.title}</p>
                <div className='flex gap-1'>
                    <span>Today Salad : </span>
                    <span className={`px-2 py-1 rounded text-sm ${order.status == "delivered" ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {order?.currentProduct?.title}
                    </span>
                </div>
                <p>Start Date : {order.startDate.toString().slice(0, 10)}</p>
                <p>Total Days Delivered : <span className='font-bold'>{order?.deliveryDates?.length || 0}</span></p>

                <div className='flex justify-between items-center'>
                    <p>
                        Price : {!order.extraCharge ? `${order.finalPrice} /-` : `${order?.finalPrice} + ${order?.extraCharge} = ${parseInt(order.finalPrice) + parseInt(order.extraCharge)} /-`}
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
                                    new Date(date).toUTCString().slice(0, 3) + " " + formatDate(date)
                                }
                            </div>
                        </div>
                    })}
                </div>

                <div className='flex justify-between items-center mt-4 mb-2'>
                    <h3 className="font-medium text-gray-800">Postponed Dates</h3>
                    <form onSubmit={handlePostpone} className='flex gap-1'>
                        <input type="date" name='postponeDate' className='border rounded-md border-black p-1' />
                        <button className='p-1 bg-red-300 rounded-md'>Postpone</button>
                    </form>
                </div>
                <div className='flex gap-4 flex-wrap'>
                    {order?.postponedDates?.map((date: any, idx: any) => {
                        return <div key={idx}>
                            <div className='p-2 border-black border rounded-lg bg-yellow-300'>
                                {
                                    new Date(date).toUTCString().slice(0, 3) + " " + formatDate(date)
                                }
                            </div>
                        </div>
                    })}
                </div>

            </div>

            <ShowMessage message={order.message} />
            {(order?.deliveryDates?.length != order?.days) &&
                <>
                    <OrderButtons session={session} order={order} setOrders={setOrders} setMemberships={setMemberships} setError={setError} isMembership={true} />
                    {session?.data.user?.isAdmin && <SelectDeliveryUser users={users} orderId={order._id} isMembership={true} setOrders={setOrders} setMembership={setMemberships} setError={setError} />}
                </>
            }
        </div >
    )
}

export default MembershipCard