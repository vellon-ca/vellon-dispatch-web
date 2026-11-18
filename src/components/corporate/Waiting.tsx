"use client";

import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Application } from "@/lib/corporate";

const day = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });

/* Applications waiting for a taxi company, and recent answers. Shown on its
   own when the manager has no account yet, and for a pending application
   picked in the account menu. */
export default function Waiting({
  supabase,
  applications,
  onChanged,
}: {
  supabase: SupabaseClient;
  applications: Application[];
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function withdraw(a: Application) {
    if (!window.confirm(`Withdraw ${a.business_name}'s application to ${a.company_name}?`)) return;
    setBusy(a.id);
    setError(null);
    const { data, error: e2 } = await supabase.rpc("ba_withdraw_application", { p_application: a.id });
    setBusy(null);
    if (e2 || !data?.ok) setError("We couldn't withdraw it. It may have been answered already; refresh to see.");
    onChanged();
  }

  const shown = applications.filter((a) => a.status !== "withdrawn" && a.status !== "approved");
  return (
    <div className="cp-main cp-narrow">
      <div className="cp-head"><div><h1 style={{ margin: 0, fontSize: 20 }}>Applications</h1></div></div>
      <div className="cp-card">
        {shown.map((a) => (
          <div key={a.id} className="cp-row">
            <div style={{ flex: 1 }}>
              <div className="cp-who">{a.business_name} · {a.company_name}</div>
              <div className="cp-who-sub">
                {a.status === "pending"
                  ? `Sent ${day(a.created_at)}. Waiting for ${a.company_name}; we'll email you when they decide.`
                  : `Declined ${a.decided_at ? day(a.decided_at) : ""}${a.decline_reason ? `. Their reason: ${a.decline_reason}` : "."}`}
              </div>
            </div>
            <span className="cp-status">
              <span className="cp-dot" style={{ background: a.status === "pending" ? "var(--amber)" : "var(--red)" }} />
              {a.status === "pending" ? "Waiting for approval" : "Declined"}
            </span>
            {a.status === "pending" && (
              <button className="cp-btn cp-btn-sm" disabled={busy === a.id} onClick={() => withdraw(a)}>Withdraw</button>
            )}
          </div>
        ))}
      </div>
      {error && <div className="cp-error">{error}</div>}
    </div>
  );
}
