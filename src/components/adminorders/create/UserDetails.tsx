import { Pencil, X, Save } from "lucide-react";
const UserDetails = ({ user, isEditingContact, setIsEditingContact, handleContactSubmit, setContact }: any) => (
    <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="font-semibold text-lg mb-4">User Details</h2>
        <p className="text-gray-800 mb-2">Name: {user.name}</p>
        <p className="text-gray-800 mb-4">Email: {user.email}</p>
        <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-700 font-medium">Contact Information</h3>
                <button
                    onClick={() => setIsEditingContact(!isEditingContact)}
                    className="text-blue-600 hover:text-blue-700"
                >
                    {isEditingContact ? <X size={20} /> : <Pencil size={20} />}
                </button>
            </div>
            {isEditingContact ? (
                <form onSubmit={handleContactSubmit}>
                    <input
                        type="number"
                        onChange={(e) => setContact(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter contact number"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Save size={16} /> Save Contact
                    </button>
                </form>
            ) : (
                <p className="text-gray-600">{user?.contact || "No contact number added"}</p>
            )}
        </div>
    </div>
);

export default UserDetails;
