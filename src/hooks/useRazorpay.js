import { useEffect } from "react";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";
const openPayment = async ({ amount, orderId, prefill, onSuccess, onFailure }) => {
  console.log("Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID); 
function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function useRazorpay() {
  useEffect(() => {
    loadScript(RAZORPAY_SCRIPT);
  }, []);

  const openPayment = async ({ amount, orderId, prefill, onSuccess, onFailure }) => {
    const loaded = await loadScript(RAZORPAY_SCRIPT);
    if (!loaded) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      name: "FoodShare Marketplace",
      description: "Surplus Ingredient Purchase",
      order_id: orderId,
      prefill: {
        name: prefill?.name || "",
        email: prefill?.email || "",
        contact: prefill?.phone || "",
      },
      theme: { color: "#aa3bff" }, // matches your --accent
      handler: function (response) {
        // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
        onSuccess?.(response);
      },
      modal: {
        ondismiss: () => onFailure?.("dismissed"),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => onFailure?.(response.error));
    rzp.open();
  };

  return { openPayment };
}
