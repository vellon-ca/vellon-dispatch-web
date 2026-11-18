"use client";

import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Business } from "@/lib/corporate";
import OrgForm from "./OrgForm";

/* An invited manager's account that sits under no organisation yet (mockup
   "Invited manager's first visit", approved 2026-11-18). Required: set one up,
   or say which one it belongs to. Never guessed from names or domains. */
export default function PlaceAccount({
  supabase,
  account,
  businesses,
  onDone,
}: {
  supabase: SupabaseClient;
  account: { account_id: string; account_name: string; company_name: string };
  businesses: Business[];
  onDone: () => void;
}) {
  const [mode, setMode] = useState<"pick" | "new">(businesses.length ? "pick" : "new");
  const [picked, setPicked] = useState<string>(businesses[0]?.id ?? "new");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function attach(businessId: string) {
    setBusy(true);
    setError(null);
    const { data, error: e2 } = await supabase.rpc("ba_attach_account", {
      p_account: account.account_id, p_business: businessId,
    });
    setBusy(false);
    // bad_state: already placed (another tab, a co-manager); nothing to do.
    if (e2 || (!data?.ok && data?.reason !== "bad_state")) {
      setError("We couldn't save that. Try again.");
      return;
    }
    onDone();
  }

  const first = businesses.find((b) => b.id === picked);
  return (
    <div className="cp-auth">
      <div className="cp-auth-card wide">
        <div className="cp-auth-brand">{account.company_name} · Business accounts</div>
        {mode === "pick" ? (
          <>
            <h1>Add this account to {businesses.length === 1 ? businesses[0].name : "your organisation"}?</h1>
            <p>
              {account.company_name} added you as a manager of {account.account_name}. You already manage
              {businesses.length === 1 ? ` ${businesses[0].name}.` : " these organisations."}
            </p>
            {businesses.map((b) => (
              <label key={b.id} className={`cp-opt${picked === b.id ? " on" : ""}`}>
                <input type="radio" name="org" checked={picked === b.id} onChange={() => setPicked(b.id)} />
                <span>
                  <b>Yes, it&apos;s {b.name}</b>
                  <span className="cp-opt-sub">Its other managers will see it too</span>
                </span>
              </label>
            ))}
            <label className={`cp-opt${picked === "new" ? " on" : ""}`}>
              <input type="radio" name="org" checked={picked === "new"} onChange={() => setPicked("new")} />
              <span>
                <b>No, it&apos;s a different organisation</b>
                <span className="cp-opt-sub">Set one up</span>
              </span>
            </label>
            <button className="cp-btn cp-btn-primary" disabled={busy}
              onClick={() => (first ? attach(first.id) : setMode("new"))}>
              {busy ? "Saving…" : "Continue"}
            </button>
            {error && <div className="cp-error">{error}</div>}
          </>
        ) : (
          <>
            <h1>Set up your organisation</h1>
            <p>
              {account.company_name}{" "}set up an account for you. Tell us about the organisation behind it; you&apos;ll use
              it for accounts with other taxi companies too.
            </p>
            <OrgForm supabase={supabase} initialName={account.account_name} onCreated={(id) => attach(id)} />
            {error && <div className="cp-error">{error}</div>}
          </>
        )}
      </div>
    </div>
  );
}
