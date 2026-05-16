// src/supabase.js
// ─────────────────────────────────────────────────────────────
// 1. Go to supabase.com → your project → Settings → API
// 2. Copy "Project URL" and "anon public" key
// 3. Paste them below
// ─────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lgfgglbznkyleynuuoow.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZmdnbGJ6bmt5bGV5bnV1b293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDU1NDQsImV4cCI6MjA5MTc4MTU0NH0.p5QgDBbkqdGX8FZLWiaEw40Fh-5dG3dnuqY5FymO1gM"; // ← replace

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true, // session survives page refresh
    autoRefreshToken: true,
    detectSessionInUrl: true, // handles OAuth / magic link callbacks
  },
});

// ── Typed helpers ─────────────────────────────────────────────

/** Fetch the profile row for the currently logged-in user */
export async function getMyProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) {
    console.error("getMyProfile:", error);
    return null;
  }
  return data;
}

/** Fetch all non-deleted listings */
export async function getListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .neq("status", "deleted")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getListings:", error);
    return [];
  }
  return data;
}

/** Fetch cart items for the current user, joined with listing data */
export async function getMyCart() {
  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      reserved_at,
      expires_at,
      listings (*)
    `,
    )
    .order("reserved_at", { ascending: false });
  if (error) {
    console.error("getMyCart:", error);
    return [];
  }
  // flatten: merge listing fields into cart item
  return data.map((ci) => ({
    cartItemId: ci.id,
    reservedAt: new Date(ci.reserved_at).getTime(),
    expiresAt: new Date(ci.expires_at).getTime(),
    ...ci.listings,
  }));
}

/** Add a listing to the current user's cart and mark it reserved */
export async function addToCart(listingId) {
  // 1. Mark listing as reserved
  const { error: le } = await supabase
    .from("listings")
    .update({ status: "reserved" })
    .eq("id", listingId)
    .eq("status", "active"); // only if still active
  if (le) return { error: le };

  // 2. Insert cart item
  const { error: ce } = await supabase
    .from("cart_items")
    .insert({ listing_id: listingId });
  if (ce) {
    // rollback listing status
    await supabase
      .from("listings")
      .update({ status: "active" })
      .eq("id", listingId);
    return { error: ce };
  }
  return { error: null };
}

/** Remove a listing from cart and release it back to active */
export async function removeFromCart(cartItemId, listingId) {
  await supabase.from("cart_items").delete().eq("id", cartItemId);
  await supabase
    .from("listings")
    .update({ status: "active" })
    .eq("id", listingId);
}

/** Confirm order: creates order + order_items, clears cart */
export async function confirmOrder(cart, payMethod) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const total = cart.reduce((s, i) => s + (i.price || 0), 0);

  // 1. Create order
  const { data: order, error: oe } = await supabase
    .from("orders")
    .insert({ user_id: user.id, pay_method: payMethod, total })
    .select()
    .single();
  if (oe) return { error: oe };

  // 2. Insert order items
  const items = cart.map((i) => ({
    order_id: order.id,
    listing_id: i.id,
    price: i.price || 0,
    qty: i.qty,
    unit: i.unit,
  }));
  const { error: ie } = await supabase.from("order_items").insert(items);
  if (ie) return { error: ie };

  // 3. Mark listings as expired (sold/picked up pending)
  await supabase
    .from("listings")
    .update({ status: "expired" })
    .in(
      "id",
      cart.map((i) => i.id),
    );

  // 4. Clear cart
  await supabase
    .from("cart_items")
    .delete()
    .in(
      "listing_id",
      cart.map((i) => i.id),
    );

  return { error: null, orderId: order.id };
}

/** Release expired cart reservations (call on app mount & periodically) */
export async function releaseExpiredReservations() {
  await supabase.rpc("release_expired_cart");
}
