import {
    updateOrderQuantity,
    removeProductFromOrder,
    addExtraCharge,
    updatePaymentStatus,
} from '@/src/actions/Order';
import { toast } from 'react-toastify';
import { AssignedDetails, OrderButtons, ShowMessage, UserBasicDetails } from './OrderBasicDetails';

function orderCard({ order, setOrders, setError, session }: any) {



    const handleQuantityUpdate = async (orderId: any, productId: any, newQuantity: any) => {
        try {
            const updatedOrder = await updateOrderQuantity(orderId, productId, newQuantity);
            setOrders((prev: any) => (prev.map((order: any) =>
                order._id === orderId ? updatedOrder : order
            )));
            setError('');
        } catch (err) {
            setError('Failed to update quantity');
            console.error(err);
        }
    };

    const handleRemoveProduct = async (orderId: any, productId: any) => {
        try {
            const updatedOrder = await removeProductFromOrder(orderId, productId);
            setOrders((prev: any) => (prev.map((order: any) =>
                order._id === orderId ? updatedOrder : order
            )));
            setError('');
        } catch (err) {
            setError('Failed to remove product');
            console.error(err);
        }
    };

    const handleExtraCharges = async (e: any, orderId: any, productId: any, extraCharge: any) => {
        e.preventDefault();
        try {
            console.log(extraCharge)
            const res = await addExtraCharge(orderId, productId, extraCharge);
            if (res.success) {
                setOrders((prev: any) => (prev.map((order: any) =>
                    order._id === orderId ? { ...order, orders: order.orders.map((p: any) => p._id === productId ? { ...p, extraCharge } : p) } : order
                )));
                toast.success(res.message)
            }
            setError('');
        } catch (err) {
            setError('Failed to update quantity');
            console.error(err);
        }
    }

    const handlePaymentStatus = async () => {
        try {
            const res = await updatePaymentStatus(order._id, !order?.isPaid, false);

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

    return (
        <div key={order._id} className="border rounded-lg p-4 bg-white shadow" id={order._id}>

            <UserBasicDetails order={order} />
            <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Products</h3>
                {order.orders.map((item: any) => (
                    <div key={item._id} className="mb-4 p-2 bg-gray-50 rounded">
                        <div className="flex justify-between items-start mb-2">
                            <span>{item.product.title}</span>
                            <button
                                onClick={() => handleRemoveProduct(order._id, item._id)}
                                className="text-red-600 text-sm hover:text-red-800"
                            >
                                Remove
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityUpdate(
                                    order._id,
                                    item._id,
                                    parseInt(e.target.value)
                                )}
                                className="border rounded w-20 p-1"
                                min="1"
                            />
                            <span className="text-sm text-gray-600">
                                x ₹{item.product.finalPrice} {item.extraCharge ? `+ ₹${item.extraCharge}` : ""} =
                            </span>
                            <div>{item.product.finalPrice * item.quantity + (item.extraCharge || 0)} /-</div>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <p>
                                Extra Charges : {item?.extraCharge || "No"}
                            </p>
                            <form
                                className="flex"
                                onSubmit={(e: any) => handleExtraCharges(e, order._id, item._id, parseInt(e.target.extraCharges.value))}
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

                    </div>
                ))}

                <div className='flex justify-between items-center'>
                    <p>
                        Total Price: {order.orders.reduce((sum: any, item: any) => (item.product.finalPrice * item.quantity + (item?.extraCharge || 0) + sum), 0)}
                    </p>
                    <div className='flex items-center gap-2'>
                        Paid: <input type="checkbox" className='h-4 w-4' checked={order?.isPaid || false} onChange={handlePaymentStatus} />
                    </div>
                </div>
            </div>

            <AssignedDetails order={order} />

            <ShowMessage message={order.message} />
            <OrderButtons session={session} order={order} setOrders={setOrders} setError={setError} isMembership={false} />

        </div >
    )
}

export default orderCard