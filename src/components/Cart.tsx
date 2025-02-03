"use client"
import { X, ShoppingCart, Minus, Plus, Trash2, Phone, MapPin, Save, Pencil } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { IncQty, DecQty, removeItem } from '../utility/CartFunction';
import { createOrder } from '../actions/Order';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { decreaseQuantity, increaseQuantity, removeFromCart } from '../actions/Cart';
import { Message } from '@/src/utility/SendMessage';
import { featureDetails } from '../actions/Features';
import axios from 'axios';

const Cart = () => {
  const router = useRouter();
  const session = useSession();
  const { items, setItems, isOpen, setIsOpen } = useCartContext();

  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<number>(-1);
  const [orderMessage, setOrderMessage] = useState("");
  const [pincodes, setPincodes] = useState([]);
  const [timings, setTimings] = useState<any>([]);

  // New state for contact and address management
  const [userAddresses, setUserAddresses] = useState(session?.data?.user?.addresses || []);
  const [contactNumber, setContactNumber] = useState(session?.data?.user?.contact || '');

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<any>({
    number: '',
    address: '',
    landmark: '',
    pincode: ''
  });

  const [hasContact, setHasContact] = useState(Boolean(session?.data?.user?.contact))
  const isProfileComplete = useMemo(() => hasContact && userAddresses?.length, [userAddresses?.length, hasContact])

  useEffect(() => {
    let contactDetails = session?.data?.user?.contact
    let addressesDetails = session?.data?.user?.addresses;

    if (contactDetails) {
      setContactNumber(contactDetails)
      setHasContact(true)
      setIsEditingContact(false)
    } else {
      setIsEditingContact(true);
    }

    if (addressesDetails?.length) {
      setUserAddresses(addressesDetails)
      setIsAddingAddress(false);
    } else {
      setIsAddingAddress(true);
    }

  }, [session])

  useEffect(() => {
    const handleTimings = async () => {
      const indianTime = new Date((new Date()).getTime() + 19800000);
      const features = await featureDetails();
      const deliveryTimings = features.deliveryTimings;
      const availablePins = features.pincodes;
      setPincodes(availablePins);

      let finalTimings = deliveryTimings.filter((time: any) => {
        const start_HH_MM = time.startTime.split(":");
        const end_HH_MM = time.endTime.split(":");

        const tempStartTime = new Date(indianTime);
        const tempEndTime = new Date(indianTime);

        tempStartTime.setUTCHours(start_HH_MM[0], start_HH_MM[1], 0, 0);
        tempEndTime.setUTCHours(end_HH_MM[0], end_HH_MM[1], 0, 0);

        return indianTime < tempStartTime || indianTime <= tempEndTime;
      });

      if (finalTimings.length) {
        setTimings(finalTimings);
      } else {
        finalTimings = deliveryTimings.map((time: any) => ({
          ...time,
          display: time.display.replace("Today", "Tomorrow"),
        }));
        setTimings(finalTimings);
      }
    };

    handleTimings();
  }, [items.length]);

  // Update contact number
  const handleUpdateContact = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/user/contact', {
        id: session?.data?.user?._id,
        contact: contactNumber
      });

      if (res.status && res.status < 400) {
        toast.success("Contact number updated successfully");
        setHasContact(true);
        setIsEditingContact(false);
      }
    } catch (error) {
      toast.error("Failed to update contact number");
      console.error(error);
    }
  };

  // Add new address
  const handleAddAddress = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/user/address', {
        id: session?.data?.user?._id,
        address: {
          ...newAddress,
          pincode: parseInt(newAddress.pincode)
        }
      });

      if (res.status && res.status < 400) {
        toast.success("Address added successfully");
        setUserAddresses(res.data.addresses);
        setIsAddingAddress(false);
        setNewAddress({ number: '', address: '', landmark: '', pincode: '' });
      }
    } catch (error) {
      toast.error("Failed to add address");
      console.error(error);
    }
  };

  const validateCheckout = () => {
    if (!time) {
      toast.error("Please select delivery time!");
      return false;
    }
    if (selectedAddress === -1) {
      toast.error("Please select delivery address!");
      return false;
    }

    const pincode = userAddresses[selectedAddress].pincode;
    if (!pincodes.some((pin) => pin == pincode)) {
      toast.error("Not deliverable in your area!");
      return false;
    }

    if (!hasContact) {
      toast.error("Please add contact information!");
      return false;
    }

    if (contactNumber.toString().length != 10) {
      toast.error("Please Enter valid contact!");
      return false;
    }
    return true;
  };

  const totalAmount = items.reduce((sum, item) => item.product.isAvailable ? sum + (item?.product?.finalPrice * item.quantity) : sum, 0);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  const handleCheckout = async () => {
    if (totalAmount == 0) {
      toast.error("Add Something in cart")
      return
    }

    if (!validateCheckout()) return;

    if (!isProfileComplete) {
      router.push('/user');
    }

    setIsLoading(true);
    try {
      const orderItems = items.filter(item => item.product.isAvailable).map(item => ({
        product: item?.product?._id,
        quantity: item.quantity
      }));

      const response = await createOrder(
        session?.data?.user?._id,
        orderItems,
        selectedAddress,
        contactNumber,
        time,
        orderMessage
      );

      if (response.success) {
        toast.success("Order placed successfully!");
        const message = items.map((item, idx) => {
          return `PRODUCT ${idx + 1}: ${item.product.title}\n -Quantity: ${item.quantity}\n-Time : ${time}\n`;
        })
          .join("\n");

        Message(message);
        setItems([]);
        setIsOpen(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to create order");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrease = async (item: any) => {
    if (item.quantity > 1) {
      try {
        const res = await decreaseQuantity(session?.data?.user?._id, item?.product?._id);
        if (res.success) {
          DecQty(item?.product?._id, setItems);
        }
      } catch (error) {
        console.error("Error decreasing quantity:", error);
      }
    }
  };

  const handleIncrease = async (item: any) => {
    try {
      const res = await increaseQuantity(session?.data?.user?._id, item?.product?._id);
      if (res.success) {
        IncQty(item?.product?._id, setItems);
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const handleRemoveFromCart = async (item: any) => {
    try {
      const res = await removeFromCart(session?.data?.user?._id, item?.product?._id);
      if (res.success) {
        removeItem(item?.product?._id, setItems);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return (
    <>
      <div className={`fixed top-0 right-0 h-full bg-white w-full sm:w-[700px] shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className='flex h-[calc(100%-56px)] max-sm:flex-col overflow-y-auto'>
          {/* Items Section */}
          <div className='flex-1 p-4 overflow-y-auto border-r max-sm:border-b'>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart className="w-16 h-16 mb-4" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className='font-semibold text-xl'>Items</p>
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-2 border rounded-lg">
                    <img
                      src={item?.product?.image}
                      alt={item?.product?.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item?.product?.title}</h3>
                      <p className="text-green-600">Rs. {item?.product?.finalPrice.toFixed(2)}</p>

                      {item.product.isAvailable ?
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleDecrease(item)}
                            className="p-1 hover:bg-gray-100 rounded"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleIncrease(item)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div> :
                        <div className='text-red-600 text-sm'>
                          Out Of Stock
                        </div>
                      }

                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Details Section */}
          {items.length > 0 && (
            <div className='flex-1 p-4 overflow-y-auto'>
              <div>
                <p className='font-semibold text-xl'>Delivery Details</p>

                <div>
                  <p className="mt-4">Add Message:</p>
                  <input type="text" className="mt-2 border rounded-3xl w-full px-4 py-2" placeholder='Need Changes' onChange={(e) => setOrderMessage(e.target.value)} />
                </div>

                <div className="mb-4">
                  <p className="mt-4">Select Delivery Time:</p>
                  <select
                    className="mt-2 border rounded-3xl w-full px-4 py-2"
                    name="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  >
                    <option value="">Select</option>
                    {timings.map((time: any, idx: any) => (
                      <option value={`${time.deliveryTime}`} key={time._id}>{time.display}</option>
                    ))}
                  </select>
                </div>

                {/* Address Selection */}
                {userAddresses.length > 0 ? (
                  <div className="my-2 max-h-60 overflow-y-auto">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">Select Address </p>
                    </div>

                    {userAddresses.map((addr: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-2 border rounded-lg cursor-pointer ${selectedAddress === idx ? 'border-green-500 bg-green-50' : ''}`}
                        onClick={() => setSelectedAddress(idx)}
                      >
                        <p className="text-sm">{addr.address}</p>
                        <p className="text-xs text-gray-500">{addr.landmark} - {addr.pincode}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 p-3 bg-yellow-50 rounded-lg text-center">
                    <p className="text-sm text-yellow-700">No addresses added yet</p>
                  </div>
                )}

                {/* Contact Number Management */}
                {hasContact ?
                  <div className="my-4">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">Contact Number</p>
                    </div>
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(parseInt(e.target.value) ? parseInt(e.target.value) : '')}
                      placeholder="Enter contact number"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      required
                    />
                  </div> :
                  <div className="my-4">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">Contact Number</p>
                      <button
                        onClick={() => setIsEditingContact(!isEditingContact)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {isEditingContact ? <X size={20} /> : <Pencil size={20} />}
                      </button>
                    </div>

                    {isEditingContact ? (
                      <form onSubmit={handleUpdateContact} className="mt-2 space-y-2">
                        <input
                          type="tel"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          placeholder="Enter contact number"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          maxLength={10}
                          pattern="[0-9]{10}"
                          required
                        />
                        <button
                          type="submit"
                          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                          <Save size={16} /> Add Contact
                        </button>
                      </form>
                    ) : (
                      <p className="text-gray-600 mt-1">
                        {hasContact || 'No contact number'}
                      </p>
                    )}
                  </div>
                }

                {/* Address Management */}
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">Delivery Address</p>
                    <button
                      onClick={() => setIsAddingAddress(!isAddingAddress)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {isAddingAddress ? <X size={20} /> : <Plus size={20} />}
                    </button>
                  </div>

                  {isAddingAddress && (
                    <form onSubmit={handleAddAddress} className="mt-2 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newAddress.number}
                          onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
                          placeholder="House/Flat No."
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <input
                          type="text"
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: parseInt(e.target.value) ? parseInt(e.target.value) : '' })}
                          placeholder="Pincode"
                          maxLength={6}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <textarea
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        placeholder="Full Address"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        required
                      />
                      <input
                        type="text"
                        value={newAddress.landmark}
                        onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                        placeholder="Landmark (Optional)"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        <Save size={16} /> Add Address
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Total and Checkout Button */}
              <div className='mb-4'>
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                </div>
                <button
                  disabled={isLoading || !isProfileComplete}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                  onClick={handleCheckout}
                >
                  {isLoading ? 'Processing...' : !isProfileComplete ? 'Complete Profile to Checkout' : 'Checkout'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleCart} />
      )}
    </>
  );
};

export default Cart;