"use client";

import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

/* The organisation's details, made on submit (ba_create_business). Used by the
   apply flow ("About your organisation") and an invited manager's first visit
   ("Set up your organisation"). Returns the new business's id. */
export default function OrgForm({
  supabase,
  initialName = "",
  submitLabel = "Continue",
  onCreated,
}: {
  supabase: SupabaseClient;
  initialName?: string;
  submitLabel?: string;
  onCreated: (businessId: string, phone: string) => void;
}) {
  const [name, setName] = useState(initialName);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { data, error: e2 } = await supabase.rpc("ba_create_business", {
      p_name: name, p_address: address, p_phone: phone,
    });
    setBusy(false);
    if (e2 || !data?.ok) {
      setError(
        data?.reason === "too_many"
          ? "You've set up several organisations today. Try again tomorrow."
          : data?.reason === "bad_request"
            ? "Check the name and address."
            : "We couldn't save that. Try again.",
      );
      return;
    }
    onCreated(data.id as string, phone.trim());
  }

  return (
    <form onSubmit={save}>
      <div className="cp-field">
        <label className="cp-label" htmlFor="org-name">Organisation name</label>
        <input id="org-name" className="cp-input" required maxLength={120} autoComplete="organization"
          value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="cp-field">
        <label className="cp-label" htmlFor="org-address">Billing address</label>
        <input id="org-address" className="cp-input" required maxLength={300} autoComplete="street-address"
          value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div className="cp-field">
        <label className="cp-label" htmlFor="org-phone">Phone</label>
        <input id="org-phone" className="cp-input" type="tel" required maxLength={40} autoComplete="tel"
          value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <button className="cp-btn cp-btn-primary" disabled={busy || !name.trim() || !address.trim() || !phone.trim()}>
        {busy ? "Saving…" : submitLabel}
      </button>
      {error && <div className="cp-error">{error}</div>}
    </form>
  );
}
