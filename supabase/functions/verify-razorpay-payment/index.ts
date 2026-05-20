import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      cartItems,
      total,
    } = await req.json();

    // 1. Verify HMAC signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(RAZORPAY_KEY_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(body)
    );
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== razorpay_signature) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid payment signature" }),
        { status: 400, headers: { "Content-Type": "application/json", ...CORS } }
      );
    }

    // 2. Save order
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total,
        pay_method: "razorpay",
        status: "confirmed",
        reference: razorpay_payment_id,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Insert order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      listing_id: item.listing_id,
      price: item.listings.price,
      qty: item.listings.qty,
      unit: item.listings.unit,
    }));
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) throw itemsError;

    // 4. Mark listings as expired (sold)
    await supabase
      .from("listings")
      .update({ status: "expired" })
      .in("id", cartItems.map((i: any) => i.listing_id));

    // 5. Clear cart
    await supabase.from("cart_items").delete().eq("user_id", userId);

    return new Response(
      JSON.stringify({ success: true, orderId: order.id }),
      { headers: { "Content-Type": "application/json", ...CORS } }
    );

  } catch (err: any) {
    console.error("verify-razorpay-payment error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...CORS } }
    );
  }
});
