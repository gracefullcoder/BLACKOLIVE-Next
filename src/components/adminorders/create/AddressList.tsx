import { Plus,X } from "lucide-react";
const AddressList = ({ user, setOrderDetails, setIsAddingAddress, isAddingAddress }: any) => (
    <div className="p-4 bg-white rounded-lg shadow-md w-full">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Addresses</h2>
            <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="text-blue-600 hover:text-blue-700"
            >
                {isAddingAddress ? <X size={20} /> : <Plus size={20} />}
            </button>
        </div>
        {user?.addresses?.map((address: any, index: number) => (
            <div
                key={index}
                className="p-4 mb-2 border rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={() => setOrderDetails((prev: any) => ({ ...prev, address: index }))}
            >
                <p className="text-gray-800">#{address.number}, {address.address}</p>
                {address.landmark && <p className="text-gray-600 text-sm">Landmark: {address.landmark}</p>}
                <p className="text-gray-600 text-sm">Pincode: {address.pincode}</p>
            </div>
        ))}
    </div>
);

export default AddressList;