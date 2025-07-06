"use client";

import { toast } from "react-toastify";
import { handleToast } from "../utility/basic";
import { createRazorpayOrder } from "../actions/Payment";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface DisplayRazorpayProps {
  totalAmount: number;
  paymentUrl: string;
  userName: string;
  successUrl: string;
  orderDetails: any;
  updateChanges: () => void;
}

export async function displayRazorpay(
  { orderDetails, totalAmount, additionalDetails, updateFnx }: any
) {
  if (typeof window === "undefined") return;

  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!res) {
    alert("Razorpay SDK failed to load.");
    return;
  }

  const orderResponse = await createRazorpayOrder(totalAmount);

  if (!orderResponse || !orderResponse.id) {
    alert("Server error while creating order.");
    return;
  }

  const { amount, id: order_id, currency } = orderResponse;

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: amount.toString(),
    currency,
    name: additionalDetails?.productDetails?.title || "Black Olive",
    description: additionalDetails?.productDetails?.description || "Order Fresh Salads",
    image: additionalDetails?.productDetails?.image || "https://ik.imagekit.io/vaibhav11/BLACKOLIVE/tr:w-40,h-40/newlogo.png?updatedAt=1750700640825",
    order_id,
    handler: async function (response: any) {
      const paymentData = {
        orderCreationId: order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature
      };

      orderDetails['paymentId'] = paymentData.razorpayPaymentId;

      const mailData = { title: additionalDetails?.productDetails?.title, finalPrice: totalAmount };
      const result = await updateFnx(orderDetails, paymentData, mailData);

      handleToast(result);
      handleToast({ success: result?.mailRes, message: "Mail sent!" });
    },
    prefill: {
      name: additionalDetails?.userDetails?.name,
      email: additionalDetails?.userDetails?.email,
      contact: orderDetails?.contact || additionalDetails?.userDetails?.contact || "7211166616"
    },
    // notes: {
    //   address: 
    // },
    theme: {
      color: "#61dafb"
    }
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}
