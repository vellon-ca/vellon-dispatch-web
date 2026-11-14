"use client";

import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { formatPhone, parseEntry, splitEntries, type ManagedAccount, type Team } from "@/lib/corporate";

const RESULT: Record<string, { label: string; color: string }> = {
  added: { label: "Invited", color: "var(--green)" },
  already_member: { label: "Already on this account", color: "var(--text-3)" },
  bad_phone: { label: "Not a phone number we can use", color: "var(--red)" },
  bad_email: { label: "Not an email address", color: "var(--red)" },
  bad_team: { label: "That team no longer exists", color: "var(--red)" },
  bad_request: { label: "Couldn't add", color: "var(--red)" },
};

type Row = { shown: string; result: string };

export default function AddPeople({
  supabase,
  account,
  teams,
  defaultTeam,
  onClose,
  onDone,
}: {
  supabase: SupabaseClient;
  account: ManagedAccount;
  teams: Team[];
  defaultTeam: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [text, setText] = useState("");
  const [team, setTeam] = useState(defaultTeam);
  const [booker, setBooker] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);

  const pieces = splitEntries(text);

  async function send() {
    if (pieces.length === 0) return;
    if (pieces.length > 500) {
      setError("Up to 500 at a time. Split the list and add the rest after.");
      return;
    }
    setBusy(true);
    setError(null);
    const entries = pieces.map((p) => ({
      ...parseEntry(p),
      role: booker ? "booker" : "rider",
      ...(team ? { team_id: team } : {}),
    }));
    const { data, error: e } = await supabase.rpc("ba_add_members", {
      p_account: account.account_id,
      p_entries: entries,
    });
    setBusy(false);
    if (e || !data?.ok) {
      setError("We couldn't send the invites. Try again.");
      return;
    }
    const results = data.results as string[];
    setRows(
      entries.map((en, i) => ({
        shown: "phone" in en ? formatPhone(en.phone) : en.email,
        result: results[i] ?? "bad_request",
      })),
    );
    onDone();
  }

  const n = (r: string) => rows?.filter((x) => x.result === r).length ?? 0;
  const bad = rows ? rows.length - n("added") - n("already_member") : 0;

  return (
    <div className="cp-scrim" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cp-dialog">
        {rows === null ? (
          <>
            <h2>Add people to {account.account_name}</h2>
            <p>
              Paste phone numbers or emails, one per line or separated by commas. Each person gets an invite in the
              {" "}{account.company_name} app and has to accept it before rides go on the account.
            </p>
            <div className="cp-field">
              <label className="cp-label" htmlFor="cp-entries">Phones or emails</label>
              <textarea id="cp-entries" className="cp-textarea" autoFocus value={text} onChange={(e) => setText(e.target.value)} />
              <div className="cp-hint" style={{ marginTop: 6 }}>
                {pieces.length} {pieces.length === 1 ? "entry" : "entries"} · numbers without a country code are read as Canadian
              </div>
            </div>
            <div className="cp-field">
              <label className="cp-label" htmlFor="cp-team">Team</label>
              <select id="cp-team" className="cp-select" value={team} onChange={(e) => setTeam(e.target.value)}>
                <option value="">No team</option>
                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <label className="cp-check">
              <input type="checkbox" checked={booker} onChange={(e) => setBooker(e.target.checked)} />
              <span>
                Can book rides for others
                <span className="cp-hint" style={{ display: "block" }}>
                  For front desks and coordinators. They can book a ride on the account for anyone.
                </span>
              </span>
            </label>
            {error && <div className="cp-error">{error}</div>}
            <div className="cp-actions">
              <button className="cp-btn" onClick={onClose}>Cancel</button>
              <button className="cp-btn cp-btn-primary" disabled={busy || pieces.length === 0} onClick={send}>
                {busy ? "Sending…" : `Send ${pieces.length || ""} ${pieces.length === 1 ? "invite" : "invites"}`}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Invites sent</h2>
            <p>Anything not sent is listed with the reason. Fix it and add it again.</p>
            <div className="cp-totals">
              <span><b>{n("added")}</b>invited</span>
              {n("already_member") > 0 && <span><b>{n("already_member")}</b>already on the account</span>}
              {bad > 0 && <span><b>{bad}</b>not sent</span>}
            </div>
            <div className="cp-results">
              {rows.map((r, i) => (
                <div key={i} className="cp-row">
                  <span className="cp-dot" style={{ background: RESULT[r.result]?.color ?? "var(--red)" }} />
                  <span className="cp-mono">{r.shown}</span>
                  <span className="cp-hint">{RESULT[r.result]?.label ?? r.result}</span>
                </div>
              ))}
            </div>
            <p className="cp-hint">
              People who already have the app see the invite on their home screen. Everyone else sees it when they sign
              up with that number or email.
            </p>
            <div className="cp-actions">
              <button className="cp-btn" onClick={() => { setRows(null); setText(""); }}>Add more</button>
              <button className="cp-btn cp-btn-primary" onClick={onClose}>Done</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
