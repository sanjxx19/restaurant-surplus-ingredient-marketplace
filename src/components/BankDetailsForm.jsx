// src/components/BankDetailsForm.jsx
// Simple form to save bank account info on the profiles table.
// NOT a Razorpay payout integration — just stores details for manual/admin payouts.
import { useState } from "react";
import { supabase } from "../supabase";

export default function BankDetailsForm({ profile, onSaved }) {
  const [form, setForm] = useState({
    bank_name: profile?.bank_name || "",
    bank_account: profile?.bank_account || "",
    bank_ifsc: profile?.bank_ifsc || "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSave() {
    setSaving(true);
    setMsg("");
    const { error } = await supabase
      .from("profiles")
      .update({
        bank_name: form.bank_name,
        bank_account: form.bank_account,
        bank_ifsc: form.bank_ifsc,
        bank_linked: true,
      })
      .eq("id", profile.id);

    setSaving(false);
    if (error) {
      setMsg("❌ Failed to save: " + error.message);
    } else {
      setMsg("✅ Bank details saved!");
      onSaved?.();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      <h3>Bank Account Details</h3>
      <p style={{ fontSize: 14, color: "#888" }}>
        Required to receive payouts when your listings sell.
      </p>
      <input
        placeholder="Bank name (e.g. SBI, HDFC)"
        value={form.bank_name}
        onChange={e => setForm(f => ({ ...f, bank_name: e.target.value }))}
      />
      <input
        placeholder="Account number"
        value={form.bank_account}
        onChange={e => setForm(f => ({ ...f, bank_account: e.target.value }))}
      />
      <input
        placeholder="IFSC code"
        value={form.bank_ifsc}
        onChange={e => setForm(f => ({ ...f, bank_ifsc: e.target.value }))}
      />
      <button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Bank Details"}
      </button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
