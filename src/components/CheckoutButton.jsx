// src/components/CheckoutButton.jsx
import { useState } from "react";
import { useRazorpay } from "../hooks/useRazorpay";
import { supabase } from "../supabase";

const styles = `
  @keyframes checkDraw {
    from { stroke-dashoffset: 60; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes ringPop {
    0%   { transform: scale(0.6); opacity: 0; }
    70%  { transform: scale(1.12); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .checkout-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px 20px;
    border-radius: 14px;
    background: #f0faf4;
    border: 1.5px solid #6fcf97;
    animation: fadeSlideUp 0.35s ease both;
  }
  .checkout-success .ring {
    animation: ringPop 0.45s cubic-bezier(.22,.68,0,1.2) both;
  }
  .checkout-success .ring circle {
    fill: #eafaf1;
    stroke: #27ae60;
    stroke-width: 2.5;
  }
  .checkout-success .ring polyline {
    fill: none;
    stroke: #27ae60;
    stroke-width: 2.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 60;
    animation: checkDraw 0.4s 0.3s ease both;
  }
  .checkout-success h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    color: #1a5c35;
  }
  .checkout-success p {
    margin: 0;
    font-size: 13px;
    color: #2d7a4f;
    text-align: center;
    line-height: 1.5;
  }
  .checkout-success .order-id {
    font-family: ui-monospace, monospace;
    font-size: 11px;
    background: #d4edda;
    color: #1a5c35;
    padding: 4px 10px;
    border-radius: 6px;
    letter-spacing: 0.5px;
  }
  .checkout-success .dismiss-btn {
    margin-top: 4px;
    padding: 8px 20px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 8px;
    border: 1.5px solid #27ae60;
    background: #fff;
    color: #1a5c35;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .checkout-success .dismiss-btn:hover {
    background: #27ae60;
    color: #fff;
  }
`;

export default function CheckoutButton({ cartItems, total, onSuccess }) {
  const { openPayment } = useRazorpay();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(null); // { orderId, paymentId }

  async function handleCheckout() {
    if (!cartItems?.length) return;
    setLoading(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        alert("Please log in first.");
        return;
      }

      const { data: rzpOrder, error: orderErr } = await supabase.functions.invoke(
        "create-razorpay-order",
        { body: { amount: total, receipt: `rcpt_${Date.now()}` } }
      );

      if (orderErr || !rzpOrder?.id) {
        console.error("Razorpay order creation failed:", orderErr, rzpOrder);
        alert("Could not initiate payment. Please try again.");
        return;
      }

      openPayment({
        amount: total,
        orderId: rzpOrder.id,
        prefill: {
          name: user.user_metadata?.name || "",
          email: user.email || "",
        },

        onSuccess: async (response) => {
          const reshapedCart = cartItems.map((item) => ({
            listing_id: item.id,
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

          // ✅ Show inline success state instead of alert
          setConfirmed({
            orderId: verifyData.orderId,
            paymentId: response.razorpay_payment_id,
          });
          onSuccess?.({ orderId: verifyData.orderId });
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

  if (confirmed) {
    return (
      <>
        <style>{styles}</style>
        <div className="checkout-success">
          <svg className="ring" width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="23" />
            <polyline points="15,27 22,34 37,19" />
          </svg>
          <h3>Order Confirmed!</h3>
          <p>
            Your payment was successful. Pick up your ingredients<br />
            during the listed pickup window.
          </p>
          <span className="order-id">Order #{confirmed.orderId?.slice(0, 8).toUpperCase()}</span>
          <button
            className="dismiss-btn"
            onClick={() => setConfirmed(null)}
          >
            Continue Shopping
          </button>
        </div>
      </>
    );
  }

  return (
    <button onClick={handleCheckout} disabled={loading || !cartItems?.length}>
      {loading ? "Processing..." : `Pay ₹${total}`}
    </button>
  );
}
