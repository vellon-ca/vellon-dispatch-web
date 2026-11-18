"use client";

import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

/* The manager's name, asked once on their first visit (mockup "Portal: first
   visit asks the name", approved 2026-11-18) and changeable later from the
   email at the top. It belongs to the person, across every account they
   manage: ba_set_my_manager_name keys it by their sign-in email. */
export default function Welcome({
  supabase,
  current,
  onSaved,
  onCancel,
}: {
  supabase: SupabaseClient;
  current: string | null;
  onSaved: (name: string) => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(current ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { data, error: e2 } = await supabase.rpc("ba_set_my_manager_name", { p_name: name });
    setBusy(false);
    if (e2 || !data?.ok) {
      setError(data?.reason === "bad_name" ? "Enter your name (80 characters at most)." : "We couldn't save that. Try again.");
      return;
    }
    onSaved(name.trim().replace(/\s+/g, " "));
  }

  return (
    <div className="cp-auth">
      <div className="cp-auth-card">
        <div className="cp-auth-brand">Business accounts</div>
        <form onSubmit={save}>
          <h1>{current ? "Your name" : "Welcome"}</h1>
          <p>What&apos;s your name? The taxi company sees it next to your email, and so do the other managers of your accounts.</p>
          <label className="cp-label" htmlFor="cp-name">Your name</label>
          <input
            id="cp-name"
            className="cp-input"
            autoComplete="name"
            maxLength={80}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="cp-btn cp-btn-primary" disabled={busy || !name.trim()}>
            {busy ? "Saving…" : current ? "Save" : "Continue"}
          </button>
          {error && <div className="cp-error">{error}</div>}
          {onCancel ? (
            <div style={{ marginTop: 16 }}>
              <button type="button" className="cp-link cp-link-muted" onClick={onCancel}>Cancel</button>
            </div>
          ) : (
            <p style={{ marginTop: 18, marginBottom: 0, fontSize: 12 }}>Asked once. You can change it later by clicking your email at the top.</p>
          )}
        </form>
      </div>
    </div>
  );
}
