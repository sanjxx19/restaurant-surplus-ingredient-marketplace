
# Restaurant Surplus Ingredient Marketplace



This is a platform that connects restaurants with surplus/excess ingredients to receivers (NGOs, small businesses, individuals) who can buy or claim them at low or zero cost. Here's how it works based on the codebase and schema:

---



## Who can use it



There are three user roles:

- **Restaurant** — lists surplus ingredients for pickup
- **Receiver** — browses listings and orders ingredients
- **Admin** — manages the platform

---



## As a Restaurant

1. **Sign up / log in** with your restaurant account
2. **Create a listing** for surplus ingredients, filling in:
     - Item name, category, emoji
     - Quantity & unit (e.g. 5 kg)
     - Storage type (fridge, dry, frozen, etc.)
     - Expiry date & pickup window
     - Price (or mark it as **free**)
     - Optional: description, allergens, certifications (e.g. FSSAI)
3. Your listing goes **live as `active`** and receivers can see it
4. When someone reserves it, status changes to `reserved`, and after pickup it becomes `expired`

---



## As a Receiver

1. **Sign up / log in** as a receiver
2. **Browse the marketplace** — see active listings with name, quantity, price, expiry, and pickup info
3. **Add items to your cart** — this temporarily reserves the listing for 2 hours (enforced by `expires_at` in `cart_items`)
4. **Checkout** via Razorpay (UPI, cards, netbanking etc.) — payment is processed in ₹INR
5. After successful payment, your **order is confirmed** and you get an order record with a Razorpay reference ID
6. **Pick up** the ingredient from the restaurant during the listed pickup window

---



## Payment Flow



The app uses **Razorpay** for payments with a secure server-side verification:

1. Frontend calls the `create-razorpay-order` Supabase Edge Function to generate a Razorpay order
2. Razorpay checkout opens in-browser
3. On success, the `verify-razorpay-payment` Edge Function **verifies the HMAC signature** server-side before saving the order — so no one can fake a payment

---



## Key things to know

- **Cart reservations expire in 2 hours** — if you don't checkout, items go back to `active`
- Items marked `free: true` are zero-cost giveaways
- Restaurants need an **FSSAI license** field for food safety compliance
- Receivers can have a **wallet balance** (for credits/refunds)
- Profiles support document upload and bank account linking for payouts

---



## Setup requirements (for developers)



To run this locally you need:

- A **Supabase project** (URL and anon key are already in `src/supabase.js`)
- **Razorpay API keys** set as:
    - `VITE_RAZORPAY_KEY_ID` in your `.env` file
    - `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` as Supabase Edge Function secrets
- Deploy the two Edge Functions (`create-razorpay-order`, `verify-razorpay-payment`) to your Supabase project



Run the app with:

 bash

```bash
npm install
npm run dev
```

