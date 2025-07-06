import React from 'react'

function OrderMap({ orderItems }: any) {
    return (
        <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Product Name</th>
                    <th className="border border-gray-300 px-4 py-2">Quantity</th>
                </tr>
            </thead>
            <tbody>
                {[...orderItems.keys()].map((key) => (
                    <tr key={key}>
                        <td className="border border-gray-300 px-4 py-2">
                            {orderItems.get(key)?.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                            {orderItems.get(key)?.quantity}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default OrderMap