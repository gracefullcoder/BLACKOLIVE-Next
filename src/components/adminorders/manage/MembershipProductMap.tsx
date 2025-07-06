import React from 'react'

function MembershipProductMap({productItems}:any) {
    return (
        <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Product Name</th>
                    <th className="border border-gray-300 px-4 py-2">Quantity</th>
                </tr>
            </thead>
            <tbody>
                {[...productItems.keys()].map((key,idx) => (
                    <tr key={key + idx}>
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
    )
}

export default MembershipProductMap;