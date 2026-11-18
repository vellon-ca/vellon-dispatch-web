"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

type BizManager = {
  id: string;
  email: string;
  name: string | null;
  invite_sent_at: string | null;
  last_sign_in_at: string | null;
  is_me: boolean;
};

const day = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });

const REASONS: Record<string, string> = {
  bad_email: "That doesn't look like an email address.",
  already_manager: "They're already a manager.",
  email_unavailable: "This email signs in to a taxi company's dispatch dashboard, so it can't be a manager. Use a different address.",
  last_manager: "An organisation always keeps one manager. Add someone else first.",
};

/* The organisation's managers: they run every account it has, with every
   taxi company. Any of them can add (by email; they get an invite) or remove
   another (business-portal-design.md, "Business managers"). */
export default function Managers({
  supabase,
  businessId,
  businessName,
}: {
  supabase: SupabaseClient;
  businessId: string;
  businessName: string;
}) {
  const [list, setList] = useState<BizManager[] | null>(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [version, setVersion] = useState(0);
  const load = () => setVersion((v) => v + 1);
  useEffect(() => {
    let alive = true;
    supabase.rpc("ba_list_business_managers", { p_business: businessId }).then(({ data }) => {
      if (alive) setList((data ?? []) as BizManager[]);
    });
    return () => {
      alive = false;
    };
  }, [supabase, businessId, version]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { data, error: e2 } = await supabase.rpc("ba_add_business_manager", { p_business: businessId, p_email: email });
    setBusy(false);
    if (e2 || !data?.ok) {
      setError(REASONS[data?.reason] ?? "We couldn't add them. Try again.");
      return;
    }
    setEmail("");
    load();
  }

  async function remove(m: BizManager) {
    const who = m.name ?? m.email;
    const q = m.is_me
      ? `Stop managing ${businessName}? You'll lose access to its accounts.`
      : `Remove ${who} as a manager of ${businessName}? They'll lose access to its accounts.`;
    if (!window.confirm(q)) return;
    setError(null);
    const { data, error: e2 } = await supabase.rpc("ba_remove_business_manager", { p_manager: m.id });
    if (e2 || !data?.ok) {
      setError(REASONS[data?.reason] ?? "We couldn't remove them. Try again.");
      return;
    }
    if (m.is_me) window.location.reload();
    else load();
  }

  return (
    <div className="cp-main cp-narrow">
      <div className="cp-head">
        <div>
          <h1 style={{ margin: 0, fontSize: 20 }}>Managers</h1>
          <div className="cp-hint" style={{ marginTop: 4 }}>
            They run every account {businessName} has, with every taxi company: people, teams, join links and statements.
          </div>
        </div>
      </div>
      <div className="cp-card">
        {list === null ? (
          <div className="cp-empty">Loading…</div>
        ) : (
          list.map((m) => (
            <div key={m.id} className="cp-row">
              <div style={{ flex: 1 }}>
                <div className="cp-who">{m.name ?? m.email}{m.is_me ? " (you)" : ""}</div>
                <div className="cp-who-sub">
                  {m.name ? `${m.email} · ` : ""}
                  {m.last_sign_in_at
                    ? `Last signed in ${day(m.last_sign_in_at)}`
                    : m.invite_sent_at
                      ? `Hasn't signed in yet · invite sent ${day(m.invite_sent_at)}`
                      : "Hasn't signed in yet"}
                </div>
              </div>
              <button className="cp-link cp-btn-danger" onClick={() => remove(m)}>{m.is_me ? "Leave" : "Remove"}</button>
            </div>
          ))
        )}
        <form onSubmit={add} className="cp-row" style={{ borderBottom: "none" }}>
          <input className="cp-input" type="email" placeholder="Their work email" aria-label="Add a manager by email"
            value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: 1 }} />
          <button className="cp-btn cp-btn-primary" disabled={busy || !email.trim()}>{busy ? "Adding…" : "Add manager"}</button>
        </form>
      </div>
      {error && <div className="cp-error">{error}</div>}
      <div className="cp-foot">They get an email, and sign in at corporate.vellon.ca with a code sent to that email.</div>
    </div>
  );
}
