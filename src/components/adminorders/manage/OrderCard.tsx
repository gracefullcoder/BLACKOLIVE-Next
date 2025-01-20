import {
    updateOrderStatus,
    updateOrderQuantity,
    removeProductFromOrder,
} from '@/src/actions/Order';
import { toast } from 'react-toastify';

function orderCard({ order, setOrders, setError, session }: any) {

    const handleStatusUpdate = async (orderId: any, newStatus: any) => {
        try {
            const updatedOrder = await updateOrderStatus(orderId, newStatus);
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

    return (
        <div key={order._id} className="border rounded-lg p-4 bg-white shadow" id={order._id}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Order #{order._id.slice(-6)}</h2>
                <span className={`px-2 py-1 rounded text-sm ${order.status == "delivered" ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {order.status}
                </span>
            </div>

            <div className='mb-1 pb-2  border-b'>
                <h1 className='font-semibold'>User Details</h1>
                <p>Id: {order.user._id}</p>
                <p>Name : {order?.user?.name}</p>
                <p>email: {order?.user?.email}</p>
            </div>

            <div className="mb-2">
                <p>Delivery Time: {order.time}:00</p>
                <p>Contact: {order.contact}</p>
                <p className='font-semibold mt-1'>
                    <span>Address:</span> {order.address.address}, {order.address.landmark}, {order.address.pincode}
                </p>
            </div>



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
                                x ₹{item.product.finalPrice}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {order.message && <div className='mt-4'>
                <h3 className="font-semibold mb-2">Message</h3>
                <p className='text-red-400 font-medium'>{order.message}</p>
            </div>}

            {order.status != "pending" ? <div>

                {order.assignedTo == session?.data?.user?._id ?
                    <div>
                        <button
                            onClick={() => handleStatusUpdate(order._id, "unassign")}
                            className='mt-4 px-4 py-2 rounded w-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200'>
                            Unassign Order
                        </button>

                        <button
                            onClick={() => handleStatusUpdate(order._id, "delivered")}
                            className='mt-4 px-4 py-2 rounded w-full bg-green-100 text-green-800 hover:bg-green-200'>
                            Mark as Delivered
                        </button>
                    </div> :
                    <div>
                        <button className='mt-4 px-4 py-2 rounded w-full bg-green-100 text-green-800 hover:bg-green-200'>
                            Already Assigned
                        </button>
                    </div>}

            </div>
                :
                <button onClick={() => handleStatusUpdate(order._id, "assign")}
                    className='mt-4 px-4 py-2 rounded w-full bg-green-100 text-green-800 hover:bg-green-200'>
                    Assign Yourself
                </button>
            }
        </div >
    )
}

export default orderCard