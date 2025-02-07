import { openInGoogleMaps } from "@/src/utility/basic"
import { MapPin } from "lucide-react"
import { toast } from "react-toastify"
import { updateOrderStatus, updateMembershipStatus } from "@/src/actions/Order"

export const UserBasicDetails = ({ order }: any) => {
    return (
        <>
            <div className="flex justify-between items-center mb-2">
                <h2 className={`font-semibold p-2 rounded-md ${order?.isPaid ? 'bg-green-100' : 'bg-yellow-100'}`}>Order #{order._id.slice(-6)}</h2>
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
                <p>Delivery Time: {parseInt(order.time.slice(0, 2)) > 12 ? `${parseInt(order.time.slice(0, 2)) - 12}${order.time.slice(2)}` : order.time}</p>
                <p>Contact: {order.contact}</p>
                <p className='font-semibold mt-1 cursor-pointer' onClick={() => openInGoogleMaps(`${order.address.number} ${order.address.address} ${order.address.landmark} ${order.address.pincode}`)}>
                    <span>Address:</span> {order.address.number}, {order.address.address}, {order.address.landmark}, {order.address.pincode}
                </p>
            </div>
        </>
    )
}

export const AssignedDetails = ({ order }: any) => {
    return (
        <div className='flex justify-between items-center mt-2'>
            <div>Assigned To: <span>{order?.assignedTo?.name || "None"}</span></div>

            <div>
                <button className={'border py-1 px-2 bg-green-200 rounded-md'} onClick={() => openInGoogleMaps(`${order.address.number}, ${order.address.address}, ${order.address.landmark} , ${order.address.pincode}`)}>
                    Open Location <MapPin className='inline' />
                </button>

            </div>
        </div>

    )
}


export const ShowMessage = ({ message }: any) => {
    return (
        <>
            {message && <div className='mt-4'>
                <h3 className="font-semibold mb-2">Message</h3>
                <p className='text-red-400 font-medium'>{message}</p>
            </div>}
        </>


    )
}

export const OrderButtons = ({ order, setOrders, session, setError, isMembership }: any) => {

    const handleStatusUpdate = async (orderId: any, newStatus: any) => {
        try {
            const updatedOrder = !isMembership ? await updateOrderStatus(orderId, newStatus) : await updateMembershipStatus(orderId, newStatus);
            console.log("updatedorder status", updatedOrder)
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

    return (
        <>
            {
                order.status != "pending" ? <div>
                    {order.assignedTo._id == session?.data?.user?._id ?
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

                            <button
                                onClick={() => handleStatusUpdate(order._id, "cancelled")}
                                className='mt-4 px-4 py-2 rounded w-full bg-red-100 text-red-800 hover:bg-red-200'>
                                Mark as Cancelled
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
        </>
    )
}