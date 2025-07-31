"use client"
import { X, ShoppingCart, Minus, Plus, Trash2, Phone, MapPin, Save, Pencil, Flag } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { IncQty, DecQty, removeItem } from '../utility/CartFunction';
import { createOrder } from '../actions/Order';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Message } from '@/src/utility/SendMessage';
import axios from 'axios';
import { getOrderCost } from '../actions/Payment';
import { displayRazorpay, loadScript } from '../lib/razorpay';
import { handleToast } from '../utility/basic';

const Cart = () => {
  const router = useRouter();
  const session = useSession();
  const { items, setItems, isOpen, setIsOpen, features } = useCartContext();

  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<number>(-1);
  const [orderMessage, setOrderMessage] = useState("");
  const [pincodes, setPincodes] = useState<any>([]);
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

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  useEffect(() => {
    let contactDetails = session?.data?.user?.contact
    let addressesDetails: any = session?.data?.user?.addresses;

    if (contactDetails) {
      setContactNumber(contactDetails)
      setHasContact(true)
      setIsEditingContact(false)
    } else {
      setIsEditingContact(true);
    }

    if (addressesDetails) {
      addressesDetails.forEach((add: any) => {
        add.isDeliverable = true;
      })
      setUserAddresses(addressesDetails)
    }
  }, [session])

  useEffect(() => {

    const handleTimings = async (features: any) => {
      const indianTime = new Date((new Date()).getTime() + 19800000);
      const deliveryTimings = features?.deliveryTimings;

      let finalTimings = deliveryTimings?.filter((time: any) => {
        const start_HH_MM = time.startTime.split(":");
        const end_HH_MM = time.endTime.split(":");

        const tempStartTime = new Date(indianTime);
        const tempEndTime = new Date(indianTime);

        tempStartTime.setUTCHours(start_HH_MM[0], start_HH_MM[1], 0, 0);
        tempEndTime.setUTCHours(end_HH_MM[0], end_HH_MM[1], 0, 0);

        return indianTime < tempStartTime || indianTime <= tempEndTime || false;
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

    const handlePins = async (pincodes: any) => {
      let addressesDetails: any = session?.data?.user?.addresses;
      if (addressesDetails?.length) {
        let idx = 0;
        let flag = false;
        if (isOpen) {
          for (const address of addressesDetails) {
            const pincode = address?.pincode;
            const result = pincodes.find((pin: any) => pin?.pincode == pincode);
            if (result) {
              setDeliveryCharge(result.deliveryCharge);
              setSelectedAddress(idx);
              setIsAddingAddress(false);
              address.isDeliverable = true;
              flag = true;
            } else {
              address.isDeliverable = false;
            }
            idx++;
          }
        }
        setUserAddresses(addressesDetails);

        if (isOpen && !flag) {
          setIsAddingAddress(true);
          if (addressesDetails.length > 1) toast.error("Not Deliverable at any address add new");
          else toast.error("Not Deliverable at your address add new");
        }
      }
      else {
        setIsAddingAddress(true);
      }
    }

    const config = async () => {
      if (features) {
        const availablePins = features?.pincodes;
        handlePins(availablePins);
        handleTimings(features);
        setPincodes(availablePins);
      }
    }

    config();
  }, [items.length, isOpen, features]);

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

  const validatePincode = () => {
    if (isOpen && selectedAddress != -1) {
      const pincode = userAddresses[selectedAddress].pincode;
      const result = pincodes.find((pin: any) => pin?.pincode == pincode);
      if (!result) {
        toast.error("Not deliverable in your area!");
        return false;
      } else {
        setDeliveryCharge(result.deliveryCharge);
        toast.success("Deliverable Here!");
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    if (items.length) validatePincode();
  }, [selectedAddress])

  const validateCheckout = () => {
    if (!time) {
      toast.error("Please select delivery time!");
      return false;
    }
    if (selectedAddress === -1) {
      toast.error("Please select delivery address!");
      return false;
    }

    if (!validatePincode()) return false;

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

  const orderCreation = async (orderDetails: any, mailData?: any, paymentData?: any) => {
    try {
      let response: any;
      if (paymentData) {
        console.log("tillu badmosh")
        response = await axios.post("/api/user/cart/checkout", { orderDetails, paymentData });
      } else {
        response = await createOrder(orderDetails);
        handleToast(response);
      }

      if (response?.success) {
        const message = items.map((item, idx) => {
          return `PRODUCT ${idx + 1}: ${item.product.title}\n -Quantity: ${item.quantity}\n-Time : ${time}\n`;
        })
          .join("\n");

        Message(message);
        setItems([]);
        setIsOpen(false);
      }

      return response;
    } catch (error) {
      toast.error("Internal Server Error");
    }
  }

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
      const pincode = userAddresses[selectedAddress].pincode;
      const costData: any = (await axios.post("/api/user/payment/cost", { productData: items, isMembership: false, pincode })).data;

      if (!costData?.success) {
        alert("Proceed With COD, Delivery Person will take UPI");
        return;
      }

      const { totalAmount, productDetails } = costData;

      const orderDetails = {
        userId: session?.data?.user?._id,
        orderItems: productDetails,
        addressId: selectedAddress,
        contact: contactNumber,
        time: time,
        message: orderMessage,
        isPaid: false,
        totalAmount,
        deliveryCharge
      }

      const additionalDetails = {
        userDetails: session?.data?.user,
        productDetails: {
          name: "Black Olive",
          description: "Order Fresh Salads",
          image: "https://ik.imagekit.io/vaibhav11/BLACKOLIVE/tr:w-40,h-40/newlogo.png?updatedAt=1750700640825",
        }
      };

      if (paymentMethod == "UPI") {
        orderDetails.isPaid = true;
        await displayRazorpay({ orderDetails, totalAmount, additionalDetails, updateFnx: orderCreation, isApi: true })
      } else {
        orderCreation(orderDetails)
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
        const res = await axios.post("api/user/cart/decrease", {
          userId: session?.data?.user?._id,
          productId: item?.product?._id,
        });

        if (res.data.success) {
          DecQty(item?.product?._id, setItems);
        }
      } catch (error: any) {
        console.error("Error decreasing quantity:", error?.response?.data || error.message);
      }
    }
  };

  const handleIncrease = async (item: any) => {
    try {
      const res = await axios.post("api/user/cart/increase", {
        userId: session?.data?.user?._id,
        productId: item?.product?._id,
      });

      if (res.data.success) {
        IncQty(item?.product?._id, setItems);
      }
    } catch (error: any) {
      console.error("Error increasing quantity:", error?.response?.data || error.message);
    }
  };

  const handleRemoveFromCart = async (item: any) => {
    try {
      const res = await axios.post("api/user/cart/remove", {
        userId: session?.data?.user?._id,
        productId: item?.product?._id,
      });

      if (res.data.success) {
        removeItem(item?.product?._id, setItems);
      }
    } catch (error: any) {
      console.error("Error removing from cart:", error?.response?.data || error.message);
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

        <div className='flex h-[calc(100%-56px)] max-sm:block overflow-y-auto'>
          {/* Items Section */}
          <div className='flex-1 p-4 overflow-y-auto border-r max-sm:border-b'>
            {(items.length === 0) ? (
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
                      <p className="text-green-600">Rs. {item?.product?.finalPrice?.toFixed(2)}</p>

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

                <div className="mb-2  ">
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


                <div className="flex justify-between items-center">
                  <p className="font-semibold">Delivery Address</p>
                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {isAddingAddress ? <X size={20} /> : <Plus size={20} />}
                  </button>
                </div>

                <div className="mb-2">

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

                {userAddresses.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto">
                    {userAddresses.map((addr: any, idx: number) => {
                      const isSelected = selectedAddress === idx;
                      const isDeliverable = addr.isDeliverable;

                      return (
                        <div
                          key={idx}
                          className={`p-2 border rounded-lg cursor-pointer my-2
        ${isSelected ? 'border-green-500 bg-green-50' : ''}
        ${!isDeliverable ? 'opacity-50 bg-gray-100 cursor-not-allowed' : ''}
      `}
                          onClick={() => {
                            if (isDeliverable) setSelectedAddress(idx);
                          }}
                        >
                          <p className="text-sm">{addr.address}</p>
                          <div className='flex gap-1 justify-between'>
                            <p className="text-xs text-gray-500">
                              {addr.landmark} - {addr.pincode}
                            </p>
                            {!isDeliverable && (
                              <p className="text-xs text-red-500 mt-1">Not Deliverable</p>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  </div>
                ) : (
                  <div>
                    <div className="mt-2 p-3 bg-yellow-50 rounded-lg text-center">
                      <p className="text-sm text-yellow-700">No addresses added yet</p>
                    </div>
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

                {totalAmount > 0 && <>
                  <div>
                    <p className="mt-4">Add Message:</p>
                    <input type="text" className="mt-2 border rounded-3xl w-full px-4 py-2" placeholder='Need Changes' onChange={(e) => setOrderMessage(e.target.value)} />
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-2 text-sm">Payment Method:</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("UPI")}
                        className={`flex-1 border rounded-full px-2 py-1 text-xs sm:text-sm cursor-pointer transition-colors ${paymentMethod === "UPI" ? "border-green-600 bg-green-50 font-semibold" : "border-gray-300 bg-white"}`}
                      >
                        UPI / Prepaid
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("COD")}
                        className={`flex-1 border rounded-full px-2 py-1 text-xs sm:text-sm cursor-pointer transition-colors ${paymentMethod === "COD" ? "border-green-600 bg-green-50 font-semibold" : "border-gray-300 bg-white"}`}
                      >
                        Cash on Delivery
                      </button>
                    </div>
                  </div>
                  {/* End Payment Method Selection */}

                  {/* Total and Checkout Button */}
                  <div className='mb-4'>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>₹{(totalAmount).toFixed(2)}</span>
                      </div>
                      {deliveryCharge > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Delivery Charge:</span>
                          <span>₹{deliveryCharge.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold text-base border-t pt-2">
                        <span>Total:</span>
                        <span>₹{(totalAmount + deliveryCharge).toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      disabled={isLoading || !isProfileComplete || totalAmount == 0}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                      onClick={handleCheckout}
                    >
                      {isLoading ? 'Processing...' : !isProfileComplete ? 'Complete Profile to Checkout' : 'Checkout'}
                    </button>
                  </div>
                </>}
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