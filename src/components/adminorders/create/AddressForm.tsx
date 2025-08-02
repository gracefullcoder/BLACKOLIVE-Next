import { Save } from "lucide-react";
const AddressForm = ({ isAddingAddress, handleAddressSubmit, newAddress, setNewAddress }: any) => (
    isAddingAddress && (
        <form onSubmit={handleAddressSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-semibold text-lg mb-4">Add New Address</h3>
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    value={newAddress.number}
                    onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
                    placeholder="House/Flat Number"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
                <input
                    type="number"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    placeholder="Pincode"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>
            <textarea
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                placeholder="Address"
                className="w-full px-3 py-2 mt-4 border rounded-md"
                rows={3}
                required
            ></textarea>
            <input
                type="text"
                value={newAddress.landmark}
                onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                placeholder="Landmark"
                className="w-full px-3 py-2 mt-4 border rounded-md"
            />
            <button className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-700 flex items-center gap-2">
                <Save size={16} /> Save Address
            </button>
        </form>
    )
);

export default AddressForm