import { useState } from "react";

import { useRazorpay } from "../hooks/useRazorpay";
import { createRazorpayOrder } from "../services/paymentService";
import { supabase } from "../supabase";

export default function CheckoutButton({ cartItems, total }) {
  const { openPayment } = useRazorpay();

  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    console.log("========== CHECKOUT START ==========");

    setLoading(true);

    try {
      // -----------------------------
      // AUTH
      // -----------------------------
      console.log("Fetching authenticated user...");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      console.log("Auth response:", {
        user,
        authError,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!user) {
        alert("Not logged in");
        return;
      }

      // -----------------------------
      // CREATE RAZORPAY ORDER
      // -----------------------------
      console.log("Creating Razorpay order...");
      console.log("Order total:", total);

      const receiptId = `order_${Date.now()}`;

      const rzpOrder = await createRazorpayOrder(total, receiptId);

      console.log("Razorpay order created:", rzpOrder);

      if (!rzpOrder?.id) {
        throw new Error("Invalid Razorpay order response");
      }

      // -----------------------------
      // OPEN PAYMENT WINDOW
      // -----------------------------
      console.log("Opening Razorpay checkout...");

      openPayment({
        amount: total,
        orderId: rzpOrder.id,

        prefill: {
          name: user.user_metadata?.name || "",
          email: user.email || "",
        },

        onSuccess: async (response) => {
          console.log("========== PAYMENT SUCCESS ==========");
          console.log("Razorpay response:", response);

          try {
            console.log("Verifying payment with Supabase function...");

            const { data, error } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,

                  userId: user.id,
                  cartItems,
                  total,
                },
              }
            );

            console.log("Verification response:", {
              data,
              error,
            });

            if (error) {
              console.error("Verification function error:", error);
              alert("Payment verification failed.");
              return;
            }

            if (!data?.success) {
              console.error("Verification unsuccessful:", data);
              alert("Payment verification failed.");
              return;
            }

            console.log("Payment verified successfully!");
            alert("Payment successful! 🎉");

            // redirect / clear cart / refresh here
          } catch (verifyErr) {
            console.error("Verification exception:", verifyErr);
            alert("Verification failed.");
          }
        },

        onFailure: (err) => {
          console.error("========== PAYMENT FAILED ==========");
          console.error("Payment failure:", err);

          alert("Payment failed or cancelled.");
        },
      });

      console.log("Razorpay checkout opened successfully");
    } catch (err) {
      console.error("========== CHECKOUT ERROR ==========");
      console.error(err);

      alert(err.message || "Something went wrong.");
    } finally {
      console.log("========== CHECKOUT END ==========");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || !cartItems?.length}
    >
      {loading ? "Processing..." : `Pay ₹${total}`}
    </button>
  );
}
