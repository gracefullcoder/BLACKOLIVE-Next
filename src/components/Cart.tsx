"use client"
import { X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { IncQty, DecQty, removeItem } from '../utility/CartFunction';
import { createOrder } from '../actions/Order';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { decreaseQuantity, increaseQuantity, removeFromCart } from '../actions/Cart';

const Cart = () => {
  const router = useRouter();
  const session = useSession();
  const { items, setItems, isOpen, setIsOpen } = useCartContext();

  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<number>(-1);

  const timings = ["09:00 Morning", "12:00 Noon", "15:00 Afternoon", "18:00 Evening"];
  const currTime = new Date().getHours();

  const userAddresses = session?.data?.user?.addresses || [];
  const userContact = session?.data?.user?.contact;
  const hasContact = Boolean(userContact);
  const hasAddress = userAddresses.length > 0;
  const isProfileComplete = hasContact && hasAddress;

  const formatTime = (timing: string, suffix: string): string => {
    const hour = parseInt(timing.slice(0, 2));
    if (hour > 12) {
      return (hour - 12).toString().padStart(2, '0').concat(timing.slice(2)).concat(` ${suffix}`);
    }
    return timing.concat(` ${suffix}`);
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
    if (!hasContact) {
      toast.error("Please add contact information!");
      return false;
    }
    return true;
  };

  const totalAmount = items.reduce((sum, item) => sum + (item?.product?.price * item.quantity), 0);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckout = async () => {
    if (!validateCheckout()) return;

    if (!isProfileComplete) {
      router.push('/profile');
      return;
    }

    setIsLoading(true);
    try {
      const orderItems = items.map(item => ({
        product: item?.product?._id,
        quantity: item.quantity
      }));

      const response = await createOrder(
        session?.data?.user?._id,
        orderItems,
        selectedAddress,
        userContact,
        parseInt(time.split(":")[0])
      );

      if (response.success) {
        toast.success("Order placed successfully!");
        setItems([]);
        setIsOpen(false);
        // router.push(`/orders/${response.orderId}`);
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
      <div className={`fixed top-0 right-0 h-full bg-white w-full sm:w-96 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto h-[calc(100vh-180px)]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart className="w-16 h-16 mb-4" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-2 border rounded-lg">
                  <img
                    src={item?.product?.image}
                    alt={item?.product?.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item?.product?.title}</h3>
                    <p className="text-green-600">Rs. {item?.product?.price.toFixed(2)}</p>
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
                    </div>
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

        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
            {/* Time Selection */}
            <div className="mb-4">
              <p className="mt-4">Select Delivery Time:</p>
              <select
                className="mt-4 border rounded-3xl w-full px-4 py-2"
                name="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="">Select</option>
                {currTime >= 17 ? (
                  timings.map((t, i) => (
                    <option key={i} value={t + " tomorrow"}>
                      {formatTime(t, "tomorrow")}
                    </option>
                  ))
                ) : currTime >= 0 && currTime < 8 ? (
                  timings.map((t, i) => (
                    <option key={i} value={t + " today"}>
                      {formatTime(t, "today")}
                    </option>
                  ))
                ) : (
                  timings.map((t, i) => {
                    const hour = parseInt(t.slice(0, 2));
                    if (hour - currTime > 1) {
                      return (
                        <option key={i} value={t + " today"}>
                          {formatTime(t, "today")}
                        </option>
                      );
                    }
                    return null;
                  })
                )}
              </select>
            </div>

            {/* Address Selection */}
            {userAddresses.length > 0 ? (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Select Delivery Address:</p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
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
              </div>
            ) : (
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">Please add a delivery address in your profile</p>
              </div>
            )}

            {/* Contact Information Warning */}
            {!hasContact && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">Please add contact information in your profile</p>
              </div>
            )}

            {/* Total and Checkout Button */}
            <div className="mt-4">
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

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleCart} />
      )}
    </>
  );
};

export default Cart;