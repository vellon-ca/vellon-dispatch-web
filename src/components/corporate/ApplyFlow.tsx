"use client";

import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { RIDES_PER_MONTH, type Business, type CompanyPage } from "@/lib/corporate";
import OrgForm from "./OrgForm";

/* Signed in from a taxi company's link: which organisation (or a new one),
   then the application (mockup "Applying", approved 2026-11-18). */

const REASONS: Record<string, string> = {
  closed: "This taxi company isn't taking applications online right now.",
  has_account: "This organisation already has an account with them. Sign in to the portal to use it.",
  already_applied: "This organisation's application is already waiting for them.",
  bad_request: "Fill in who will ride and how many rides a month.",
};

export default function ApplyFlow({
  supabase,
  company,
  businesses,
  onDone,
  onCancel,
}: {
  supabase: SupabaseClient;
  company: CompanyPage;
  businesses: Business[];
  onDone: () => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState<"pick" | "new" | "form">(businesses.length ? "pick" : "new");
  const [picked, setPicked] = useState<string>(businesses[0]?.id ?? "new");
  const [business, setBusiness] = useState<{ id: string; name: string; phone: string } | null>(null);
  const [who, setWho] = useState("");
  const [rides, setRides] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function choose(id: string, name: string, phoneNo: string) {
    setBusiness({ id, name, phone: phoneNo });
    setPhone(phoneNo);
    setStep("form");
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!business) return;
    setBusy(true);
    setError(null);
    const { data, error: e2 } = await supabase.rpc("ba_apply", {
      p_slug: company.slug, p_business: business.id, p_expected_use: who,
      p_rides_per_month: rides, p_phone: phone, p_note: note,
    });
    setBusy(false);
    if (e2 || !data?.ok) {
      setError(REASONS[data?.reason] ?? "We couldn't send that. Try again.");
      return;
    }
    onDone();
  }

  return (
    <div className="cp-auth">
      <div className="cp-auth-card wide">
        <div className="cp-auth-brand">{company.name} · Apply for a business account</div>
        {step === "pick" ? (
          <>
            <h1>Which organisation?</h1>
            <p>You manage an organisation on Vellon already. Is this application for it?</p>
            {businesses.map((b) => (
              <label key={b.id} className={`cp-opt${picked === b.id ? " on" : ""}`}>
                <input type="radio" name="biz" checked={picked === b.id} onChange={() => setPicked(b.id)} />
                <span>
                  <b>{b.name}</b>
                  <span className="cp-opt-sub">
                    {b.account_count === 0
                      ? "No business accounts yet"
                      : b.account_count === 1
                        ? "Has a business account with 1 taxi company"
                        : `Has business accounts with ${b.account_count} taxi companies`}
                  </span>
                </span>
              </label>
            ))}
            <label className={`cp-opt${picked === "new" ? " on" : ""}`}>
              <input type="radio" name="biz" checked={picked === "new"} onChange={() => setPicked("new")} />
              <span>
                <b>A different organisation</b>
                <span className="cp-opt-sub">Set up a new one: name, billing address, phone</span>
              </span>
            </label>
            <button
              className="cp-btn cp-btn-primary"
              onClick={() => {
                const b = businesses.find((x) => x.id === picked);
                if (b) choose(b.id, b.name, b.contact_phone ?? "");
                else setStep("new");
              }}
            >
              Continue
            </button>
          </>
        ) : step === "new" ? (
          <>
            <h1>About your organisation</h1>
            <p>The organisation {company.name} will bill. You&apos;ll use it for accounts with other taxi companies too.</p>
            <OrgForm
              supabase={supabase}
              onCreated={(id, ph) => choose(id, "", ph)}
            />
          </>
        ) : (
          <form onSubmit={send}>
            <h1>Your application</h1>
            <p>
              {business?.name ? `For ${business.name}. ` : ""}
              {company.name} reads this before setting up the account.
            </p>
            <div className="cp-field">
              <label className="cp-label" htmlFor="ap-who">Who will ride?</label>
              <textarea id="ap-who" className="cp-input cp-textarea" required maxLength={1000}
                placeholder="About 40 nurses on night shifts, and patient transport from Emergency."
                value={who} onChange={(e) => setWho(e.target.value)} />
            </div>
            <div className="cp-field">
              <label className="cp-label" htmlFor="ap-rides">Rides a month, roughly</label>
              <select id="ap-rides" className="cp-select" required value={rides} onChange={(e) => setRides(e.target.value)}>
                <option value="" disabled>Choose a range</option>
                {RIDES_PER_MONTH.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="cp-field">
              <label className="cp-label" htmlFor="ap-phone">Phone {company.name} can reach you on</label>
              <input id="ap-phone" className="cp-input" type="tel" maxLength={40} autoComplete="tel"
                value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="cp-field">
              <label className="cp-label" htmlFor="ap-note">Anything else (optional)</label>
              <textarea id="ap-note" className="cp-input cp-textarea" maxLength={2000}
                value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <button className="cp-btn cp-btn-primary" disabled={busy || !who.trim() || !rides}>
              {busy ? "Sending…" : "Send application"}
            </button>
            {error && <div className="cp-error">{error}</div>}
          </form>
        )}
        <div style={{ marginTop: 16 }}>
          <button type="button" className="cp-link cp-link-muted" onClick={onCancel}>Not now</button>
        </div>
      </div>
    </div>
  );
}
