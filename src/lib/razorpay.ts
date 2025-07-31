"use client"

import { toast } from "react-toastify";
import { handleToast } from "../utility/basic";
import { createRazorpayOrder } from "../actions/Payment";
import axios from "axios";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// lib/razorpay.ts
export async function loadScript(src: string, retries = 3, delay = 500): Promise<boolean> {
  return new Promise((resolve) => {
    const attemptLoad = (remainingRetries: number) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;

      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        resolve(true);
      };

      script.onerror = () => {
        document.body.removeChild(script);
        if (remainingRetries > 0) {
          console.log(`Retrying Razorpay load (${remainingRetries} attempts left)`);
          setTimeout(() => attemptLoad(remainingRetries - 1), delay);
        } else {
          console.error('Failed to load Razorpay after multiple attempts');
          resolve(false);
        }
      };

      document.body.appendChild(script);
    };

    attemptLoad(retries);
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
  { orderDetails, totalAmount, additionalDetails, updateFnx, isApi = false }: any
) {
  if (typeof window === "undefined") {
    alert("Window not opening")
    return;
  }

  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!res) {
    alert("Razorpay SDK failed to load.");
    return;
  }


  let orderResponse: any;
  if (isApi)
    orderResponse = (await axios.post("/api/user/payment/order", {amount:totalAmount})).data;
  else
    orderResponse = await createRazorpayOrder(totalAmount);

  console.log(orderResponse);

  if (!orderResponse?.success || !orderResponse?.order?.id) {
    alert("Server error while creating order.");
    return;
  } else {
    alert("Razorpay Payments is Facing error Go with COD Option, Delivery person would accept UPI!");
  }

  const { amount, id: order_id, currency } = orderResponse?.order;

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
      const result = await updateFnx(orderDetails, mailData, paymentData);

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
