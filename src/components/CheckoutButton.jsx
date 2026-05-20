// src/components/CheckoutButton.jsx
import { useState } from "react";
import { useRazorpay } from "../hooks/useRazorpay";
import { supabase } from "../supabase";

export default function CheckoutButton({ cartItems, total, onSuccess }) {
  const { openPayment } = useRazorpay();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (!cartItems?.length) return;
    setLoading(true);

    try {
      // 1. Get logged-in user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        alert("Please log in first.");
        return;
      }

      // 2. Create Razorpay order via Edge Function
      const { data: rzpOrder, error: orderErr } = await supabase.functions.invoke(
        "create-razorpay-order",
        { body: { amount: total, receipt: `rcpt_${Date.now()}` } }
      );

      if (orderErr || !rzpOrder?.id) {
        console.error("Razorpay order creation failed:", orderErr, rzpOrder);
        alert("Could not initiate payment. Please try again.");
        return;
      }

      // 3. Open Razorpay checkout
      openPayment({
        amount: total,
        orderId: rzpOrder.id,
        prefill: {
          name: user.user_metadata?.name || "",
          email: user.email || "",
        },

        onSuccess: async (response) => {
          // response = { razorpay_payment_id, razorpay_order_id, razorpay_signature }
          console.log("Payment done, verifying...", response);

          // cartItems from getMyCart() are FLATTENED — reshape for the Edge Function
          const reshapedCart = cartItems.map((item) => ({
            listing_id: item.id,           // after flattening, listing id is item.id
            listings: {
              price: item.price || 0,
              qty: item.qty,
              unit: item.unit,
            },
          }));

          const { data: verifyData, error: verifyErr } = await supabase.functions.invoke(
            "verify-razorpay-payment",
            {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user.id,
                cartItems: reshapedCart,
                total,
              },
            }
          );

          if (verifyErr || !verifyData?.success) {
            console.error("Verification failed:", verifyErr, verifyData);
            alert("Payment verification failed. Contact support with your payment ID: " + response.razorpay_payment_id);
            return;
          }

          alert("Payment successful! 🎉 Order confirmed.");
          onSuccess?.(); // let parent refresh cart / redirect
        },

        onFailure: (err) => {
          console.error("Payment failed/cancelled:", err);
          if (err !== "dismissed") {
            alert("Payment failed. Please try again.");
          }
        },
      });

    } catch (err) {
      console.error("Checkout error:", err);
      alert(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleCheckout} disabled={loading || !cartItems?.length}>
      {loading ? "Processing..." : `Pay ₹${total}`}
    </button>
  );
}
