import { useState } from "react";
import { useRazorpay } from "../hooks/useRazorpay";
import { createRazorpayOrder, saveOrderToDb } from "../services/paymentService";
import { supabase } from "../supabase";

export default function CheckoutButton({ cartItems, total }) {
  const { openPayment } = useRazorpay();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Create Razorpay order server-side
      const rzpOrder = await createRazorpayOrder(total, `order_${Date.now()}`);

      // 2. Open Razorpay modal
      openPayment({
        amount: total,
        orderId: rzpOrder.id,
        prefill: {
          name: user.user_metadata?.name,
          email: user.email,
        },
        onSuccess: async (response) => {
          // 3. Save confirmed order to Supabase
          await saveOrderToDb({
            userId: user.id,
            cartItems,
            total,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            payMethod: "razorpay",
          });
          alert("Payment successful! 🎉");
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
