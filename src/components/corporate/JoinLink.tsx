"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { joinLink, type JoinCode, type ManagedAccount } from "@/lib/corporate";

/* Minimal on purpose: how long a link lives, and printable or rotating codes,
   are parked (Victor 2026-11-13). Every link made here needs the manager's
   approval for each person who uses it, which is what keeps a shared link safe. */

export default function JoinLink({ supabase, account }: { supabase: SupabaseClient; account: ManagedAccount }) {
  const [codes, setCodes] = useState<JoinCode[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const [version, setVersion] = useState(0);
  const load = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let alive = true;
    supabase
      .from("account_join_codes")
      .select("id, code, requires_approval, uses, max_uses, expires_at, created_at")
      .eq("account_id", account.account_id)
      .is("revoked_at", null)
      .order("created_at", { ascending: false })
      .then(({ data, error: e }) => {
        if (!alive) return;
        if (e) setError("We couldn't load your join links.");
        else setCodes((data ?? []) as JoinCode[]);
      });
    return () => {
      alive = false;
    };
  }, [supabase, account.account_id, version]);

  async function make() {
    setBusy(true);
    setError(null);
    const { data, error: e } = await supabase.rpc("ba_create_join_code", { p_account: account.account_id });
    setBusy(false);
    if (e || !data?.ok) setError("We couldn't make a link. Try again.");
    else load();
  }

  async function turnOff(c: JoinCode) {
    if (!window.confirm("Turn this link off? Anyone who has it can no longer ask to join.")) return;
    const { data, error: e } = await supabase.rpc("ba_revoke_join_code", { p_code_id: c.id });
    if (e || !data?.ok) setError("We couldn't turn it off. Try again.");
    else load();
  }

  async function copy(c: JoinCode) {
    try {
      await navigator.clipboard.writeText(joinLink(account.company_slug, c.code));
      setCopied(c.id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setError("Copy didn't work in this browser. Select the link and copy it.");
    }
  }

  return (
    <div className="cp-body">
      <main className="cp-main" style={{ maxWidth: 760 }}>
        <div className="cp-head">
          <div>
            <h1>Join link</h1>
            <p>
              Share a link with your people instead of typing their numbers. Each person who uses it lands in
              “Asked to join” on the People page, and joins once you approve them.
            </p>
          </div>
          <button className="cp-btn cp-btn-primary" disabled={busy} onClick={make}>
            {busy ? "Making…" : "Make a link"}
          </button>
        </div>
        {error && <div className="cp-banner" style={{ color: "var(--red)" }}>{error}</div>}
        {codes === null ? (
          <div className="cp-empty">Loading…</div>
        ) : codes.length === 0 ? (
          <div className="cp-card"><div className="cp-empty">No link yet.</div></div>
        ) : (
          codes.map((c) => (
            <section key={c.id} className="cp-card">
              <div className="cp-codebox">
                <span className="cp-code-text">{c.code}</span>
                <span className="cp-linkline">{joinLink(account.company_slug, c.code)}</span>
                <button className="cp-btn cp-btn-sm" onClick={() => copy(c)}>{copied === c.id ? "Copied" : "Copy"}</button>
              </div>
              <div className="cp-row">
                <span className="cp-muted" style={{ flex: 1 }}>
                  Used {c.uses} {c.uses === 1 ? "time" : "times"}
                  {c.max_uses ? ` of ${c.max_uses}` : ""} · {c.requires_approval ? "you approve each person" : "joins straight away"}
                  {c.expires_at ? ` · ends ${new Date(c.expires_at).toLocaleDateString()}` : ""}
                </span>
                <button className="cp-link cp-btn-danger" onClick={() => turnOff(c)}>Turn off</button>
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
