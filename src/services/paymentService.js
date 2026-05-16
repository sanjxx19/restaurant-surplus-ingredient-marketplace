import { supabase } from "../supabase";

export async function createRazorpayOrder(amount, orderId) {
  const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
    body: { amount, receipt: orderId },
  });

  if (error) throw new Error(error.message);
  return data; // { id, amount, currency, receipt, ... }
}

export async function saveOrderToDb({ userId, cartItems, total, razorpayPaymentId, razorpayOrderId, payMethod }) {
  // 1. Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total,
      pay_method: payMethod,
      status: "confirmed",
      reference: razorpayPaymentId,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. Create order_items
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    listing_id: item.listing_id,
    price: item.listings.price,
    qty: item.listings.qty,
    unit: item.listings.unit,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw itemsError;

  // 3. Update listings to reserved
  await supabase
    .from("listings")
    .update({ status: "reserved" })
    .in("id", cartItems.map((i) => i.listing_id));

  // 4. Clear cart
  await supabase.from("cart_items").delete().eq("user_id", userId);

  return order;
}
