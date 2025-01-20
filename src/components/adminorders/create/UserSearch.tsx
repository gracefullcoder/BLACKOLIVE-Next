const UserSearch = ({ setEmail, setContact, handleUser, handleUserPhno }: any) => (
    <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="font-semibold text-lg mb-4">Find User</h2>
        <form onSubmit={handleUser} className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">By Email:</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter user email"
            />
            <button className="bg-blue-600 text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-700">Check User</button>
        </form>
        <form onSubmit={handleUserPhno}>
            <label className="block text-gray-700 font-medium mb-2">By Phone Number:</label>
            <input
                type="number"
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter user phone number"
            />
            <button className="bg-blue-600 text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-700">Check User</button>
        </form>
    </div>
);

export default UserSearch;