import React from 'react'

function MessagedOrder({ session, orders }: any) {
    return (
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
    )
}

export default MessagedOrder