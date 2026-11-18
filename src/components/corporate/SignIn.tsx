"use client";

import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

/* Two steps, one email. manager-sign-in makes sure the manager's identity
   exists (the signup gate stops the browser creating it), then GoTrue mails
   the 6-digit code. shouldCreateUser stays false: the identity is already
   there, and anything else would hit the gate. */

type Step = { kind: "email" } | { kind: "code"; email: string };

const REASONS: Record<string, string> = {
  bad_email: "That doesn't look like an email address.",
  not_a_manager:
    "This email isn't set up to manage a business account. Ask the taxi company to add you as a manager.",
  closed: "This taxi company isn't taking applications online right now.",
  too_many: "Too many tries from here. Wait an hour and try again.",
  email_unavailable:
    "This email is used to sign in to the dispatch dashboard, so it can't manage a business account. Use a different address.",
};

/* apply: a taxi company's slug, when signing in from its application link;
   manager-sign-in then makes a login for someone no company named yet.
   bare: just the card's contents, for the company page's Apply card. */
export default function SignIn({
  supabase,
  apply,
  bare = false,
  intro,
}: {
  supabase: SupabaseClient;
  apply?: string;
  bare?: boolean;
  intro?: string;
}) {
  const [step, setStep] = useState<Step>({ kind: "email" });
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  async function sendCode(address: string) {
    const { data, error: fnError } = await supabase.functions.invoke("manager-sign-in", {
      body: apply ? { email: address, apply } : { email: address },
    });
    if (fnError) throw new Error("We couldn't reach the sign-in service. Try again in a moment.");
    if (!data?.ok) throw new Error(REASONS[data?.reason] ?? "Something went wrong. Try again.");
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: address,
      options: { shouldCreateUser: false },
    });
    if (otpError) {
      throw new Error(
        /rate|limit|seconds/i.test(otpError.message)
          ? "Too many codes asked for. Wait a minute and try again."
          : "We couldn't send the code. Try again in a moment.",
      );
    }
  }

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    const address = email.trim().toLowerCase();
    setBusy(true);
    setError(null);
    try {
      await sendCode(address);
      setStep({ kind: "code", email: address });
      setCode("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onCode(e: React.FormEvent) {
    e.preventDefault();
    if (step.kind !== "code") return;
    setBusy(true);
    setError(null);
    const { error: vError } = await supabase.auth.verifyOtp({
      email: step.email,
      token: code.trim(),
      type: "email",
    });
    setBusy(false);
    if (vError) setError("That code didn't work. Check it, or send a new one.");
  }

  async function resend() {
    if (step.kind !== "code") return;
    setBusy(true);
    setError(null);
    try {
      await sendCode(step.email);
      setResent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const card = (
      <>
        {!bare && <div className="cp-auth-brand">Business accounts</div>}
        {step.kind === "email" ? (
          <form onSubmit={onEmail}>
            <h1>{apply ? "Apply" : "Sign in"}</h1>
            <p>{intro ?? "For people who manage a business account with a taxi company. We'll email you a 6-digit code."}</p>
            <label className="cp-label" htmlFor="cp-email">Work email</label>
            <input
              id="cp-email"
              className="cp-input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="cp-btn cp-btn-primary" disabled={busy || !email.trim()}>
              {busy ? "Sending…" : "Email me a code"}
            </button>
            {error && <div className="cp-error">{error}</div>}
          </form>
        ) : (
          <form onSubmit={onCode}>
            <h1>Check your email</h1>
            <p>We sent a code to {step.email}. It works for 10 minutes.</p>
            <label className="cp-label" htmlFor="cp-code">Code</label>
            <input
              id="cp-code"
              className="cp-input cp-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
            <button className="cp-btn cp-btn-primary" disabled={busy || code.length !== 6}>
              {busy ? "Checking…" : "Sign in"}
            </button>
            {error && <div className="cp-error">{error}</div>}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
              <button type="button" className="cp-link" onClick={resend} disabled={busy}>
                {resent ? "Sent again" : "Send a new code"}
              </button>
              <button
                type="button"
                className="cp-link cp-link-muted"
                onClick={() => {
                  setStep({ kind: "email" });
                  setError(null);
                  setResent(false);
                }}
              >
                Use another email
              </button>
            </div>
          </form>
        )}
        {!bare && <div className="cp-auth-foot">corporate.vellon.ca · Vellon</div>}
      </>
  );
  if (bare) return card;
  return (
    <div className="cp-auth">
      <div className="cp-auth-card">{card}</div>
    </div>
  );
}
