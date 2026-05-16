import { useState } from "react";
import { useRazorpay } from "../hooks/useRazorpay";
import { createRazorpayOrder } from "../services/paymentService";
import { supabase } from "../supabase";

export default function CheckoutButton({ cartItems, total }) {
  const { openPayment } = useRazorpay();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const rzpOrder = await createRazorpayOrder(total, `order_${Date.now()}`);

      openPayment({
        amount: total,
        orderId: rzpOrder.id,
        prefill: { name: user.user_metadata?.name, email: user.email },
        onSuccess: async (response) => {
          // Verify + save — all server-side
          const { data, error } = await supabase.functions.invoke("verify-razorpay-payment", {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id,
              cartItems,
              total,
            },
          });

          if (error || !data?.success) {
            alert("Payment verification failed. Contact support.");
            return;
          }

          alert("Payment successful! 🎉");
          // redirect or refresh cart here
        },
        onFailure: (err) => {
          console.error("Payment failed:", err);
          alert("Payment failed or was cancelled.");
        },
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
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
