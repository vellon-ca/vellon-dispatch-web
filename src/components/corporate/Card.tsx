"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { loadStripe, type Stripe, type Appearance } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { money, zonedDate, type CardView, type ManagedAccount } from "@/lib/corporate";

/* The business's card, for its managers (2b; mgcj-app
   .claude/notes/business-accounts-card-design.md §9, mockups "PortalCard" and
   "PortalCardMissing"). The fix follows the decline: a temporary one is tried
   again on the same card, the card itself needs a different one, and a bank
   that wants its holder to confirm gets the same card entered again here.

   The form is a Stripe Payment Element on the TAXI COMPANY's Stripe account
   (stripeAccount), cards only. It is created with no SetupIntent; one is made
   by account-card only when the manager presses Save. */

const PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

// One Stripe instance per connected account: an instance is bound to the
// account it was loaded with.
const stripes = new Map<string, Promise<Stripe | null>>();
function stripeFor(account: string) {
  let p = stripes.get(account);
  if (!p) {
    p = loadStripe(PK, { stripeAccount: account });
    stripes.set(account, p);
  }
  return p;
}

// The bank's reason in plain words (as the decline email). Codes not listed
// get no reason rather than a guess.
const BANK_SAYS: Record<string, string> = {
  insufficient_funds: "insufficient funds",
  card_velocity_exceeded: "over its limit",
  withdrawal_count_limit_exceeded: "over its limit",
  expired_card: "the card has expired",
  lost_card: "the card was reported lost or stolen",
  stolen_card: "the card was reported lost or stolen",
};

const BRAND: Record<string, string> = {
  visa: "Visa", mastercard: "Mastercard", amex: "American Express", discover: "Discover",
  diners: "Diners Club", jcb: "JCB", unionpay: "UnionPay", interac: "Interac",
};
const brandName = (b: string | null | undefined) => (b ? BRAND[b] ?? b[0].toUpperCase() + b.slice(1) : "Card");

const RETRY_ERRORS: Record<string, string> = {
  "card.tooSoon": "Wait a minute before trying again.",
  "card.tooManyAttempts": "That's enough tries for this hour. We keep trying it on our own.",
  "card.needsNew": "This card can't be tried again. Add a different card below.",
  "account.notCardMode": "This account isn't billed to a card any more.",
  "account.noCard": "There's no card on the account yet.",
  "account.cardModeUnavailable": "The taxi company can't take cards right now. Ask them.",
  forbidden: "You're not a manager of this account any more.",
};

// Save's own refusals; anything else falls back to RETRY_ERRORS.
const SAVE_ERRORS: Record<string, string> = {
  "card.tooManyAttempts": "That's a lot of cards tried in the last hour. Wait a while before trying again.",
  "card.overBudget": "This card has been declined too many times this month for us to use it. Use a different card.",
  "card.notSaved": "The card couldn't be saved. Try again, or use a different card.",
};

export default function Card({
  supabase, account, view, onChanged,
}: {
  supabase: SupabaseClient;
  account: ManagedAccount;
  view: CardView;
  onChanged: () => void;
}) {
  const tz = view.time_zone;
  const company = view.company_name ?? account.company_name;
  const reason = view.reason ?? null;
  const declined = reason === "soft" || reason === "hard" || reason === "budget" || reason === "auth";
  const rides = view.rides ?? [];
  const waiting = rides.filter((r) => r.state === "card_declined" || r.state === "no_card");
  const bank = view.decline_code ? BANK_SAYS[view.decline_code] : undefined;
  const time = (iso: string) => zonedDate(iso, tz, { hour: "numeric", minute: "2-digit" });
  const day = (iso: string) => zonedDate(iso, tz, { month: "short", day: "numeric" });
  const dayTime = (iso: string) => zonedDate(iso, tz, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  const formRef = useRef<HTMLDivElement>(null);
  const [retrying, setRetrying] = useState(false);
  const [note, setNote] = useState<{ text: string; bad?: boolean } | null>(null);

  function toForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function retry() {
    setRetrying(true);
    setNote(null);
    const { data, error } = await supabase.functions.invoke("account-card", {
      body: { action: "retry", account_id: account.account_id },
    });
    setRetrying(false);
    if (error || !data) return setNote({ text: "We couldn't reach the card just now. Try again in a moment.", bad: true });
    if (!data.ok) return setNote({ text: RETRY_ERRORS[data.code] ?? "We couldn't try the card. Try again in a moment.", bad: true });
    if (data.reopened) {
      setNote({ text: "Nothing was waiting on the card, so the account is open for bookings again. The next ride booked is the retry." });
    } else if (data.state === null) {
      setNote({ text: "It worked. The card is charged for the waiting rides, and the account is open again." });
    } else {
      setNote({
        text: `Still declined.${data.retry_at ? ` We'll try it again ourselves around ${time(data.retry_at)}.` : ""}`,
        bad: true,
      });
    }
    onChanged();
  }

  const title = declined
    ? `Your card was declined${waiting.length ? ` for ${waiting.length} booked ${waiting.length === 1 ? "ride" : "rides"}` : ""}${bank ? `: ${bank}` : ""}`
    : null;
  const fix =
    reason === "soft"
      ? view.retry_at
        ? `The card itself is fine. Once there's room on it, press Try again, or leave it: we'll try it again ourselves around ${time(view.retry_at)}, and a few times after that.`
        : "The card itself is fine. Once there's room on it, press Try again."
      : reason === "hard"
        ? "The bank won't accept this card any more. Add a different card below."
        : reason === "budget"
          ? "The card has been declined too many times this month for us to keep trying it. Add a different card below."
          : reason === "auth"
            ? "The card is fine, but the bank wants the card holder to confirm it once. Enter the same card below and save it; the bank may ask you to approve it."
            : null;

  return (
    <main className="cp-main cp-narrow">
      <div className="cp-head">
        <div>
          <h1>Card</h1>
          <p>
            {company}{" "}charges each ride to this card when it&apos;s done. A ride booked for later is held on the card
            the day before.
          </p>
        </div>
      </div>

      {declined && (
        <section className="cp-banner cp-card-alert" role="alert">
          <span className="cp-dot" style={{ background: "var(--red)", marginTop: 6 }} />
          <span className="cp-card-alert-body">
            <b>{title}</b>
            <span className="cp-hint">
              {fix}{" "}
              {waiting.length > 0 && "If a ride still isn't paid by its deadline below, the rider is asked to pay for it themselves or it's cancelled. "}
              Until then, people can&apos;t bill new rides to the account; they can still book and pay personally.
            </span>
          </span>
          <span className="cp-card-alert-act">
            {reason === "soft" ? (
              <>
                <button className="cp-btn cp-btn-primary" onClick={retry} disabled={retrying}>
                  {retrying ? "Trying…" : "Try again"}
                </button>
                {view.last_attempt_at && (
                  <span className="cp-hint">
                    Last try {time(view.last_attempt_at)}
                    {view.retry_at ? ` · next ${time(view.retry_at)}` : ""}
                  </span>
                )}
                <button className="cp-link" onClick={toForm}>Use a different card</button>
              </>
            ) : (
              <button className="cp-btn cp-btn-primary" onClick={toForm}>
                {reason === "auth" ? "Confirm the card" : "Replace the card"}
              </button>
            )}
          </span>
        </section>
      )}
      {note && (
        <div className="cp-banner" role="status" style={note.bad ? { color: "var(--red)" } : undefined}>{note.text}</div>
      )}

      <div className="cp-card-cols">
        <div>
          <section className="cp-card">
            <div className="cp-card-head"><span className="cp-card-title">Card on file</span></div>
            {view.card ? (
              <div className="cp-card-pad">
                <div className="cp-card-on-file">
                  <span className="cp-card-brand">{(view.card.brand ?? "card").toUpperCase().slice(0, 4)}</span>
                  <span>
                    <b>{brandName(view.card.brand)} ending {view.card.last4}</b>
                    <span className="cp-hint" style={{ display: "block" }}>
                      {view.card.exp_month && view.card.exp_year
                        ? `Expires ${String(view.card.exp_month).padStart(2, "0")}/${String(view.card.exp_year).slice(-2)}`
                        : ""}
                      {view.card.added_by ? ` · added by ${view.card.added_by}` : ""}
                      {view.card.added_at ? `, ${day(view.card.added_at)}` : ""}
                    </span>
                  </span>
                </div>
                {declined && view.declined_at && (
                  <div className="cp-hint">
                    <span className="cp-dot" style={{ background: "var(--red)", marginRight: 6 }} />
                    Declined {day(view.declined_at)}{bank ? `: ${bank}` : ""}.
                    {reason === "soft" && " Nothing wrong with the card."}
                  </div>
                )}
              </div>
            ) : (
              <div className="cp-card-pad cp-hint">
                No card yet. Until a manager adds one, rides can&apos;t be booked on the account.
              </div>
            )}
          </section>

          <section className="cp-card" ref={formRef}>
            <div className="cp-card-head">
              <span className="cp-card-title">
                {!view.card ? "Add a card" : reason === "auth" ? "Confirm the card" : "Use a different card"}
              </span>
            </div>
            <div className="cp-card-pad">
              {!PK ? (
                <div className="cp-hint">Adding a card isn&apos;t available here yet.</div>
              ) : !view.stripe_account || view.cards_active === false ? (
                <div className="cp-hint">{company}{" "}can&apos;t take cards right now. Ask them.</div>
              ) : (
                <CardElements stripeAccount={view.stripe_account}>
                  <CardForm
                    supabase={supabase}
                    accountId={account.account_id}
                    company={company}
                    saveLabel={reason === "auth" ? "Confirm card" : "Save card"}
                    onSaved={(text, bad) => { setNote({ text, bad }); onChanged(); }}
                  />
                </CardElements>
              )}
            </div>
          </section>
        </div>

        <section className="cp-card">
          <div className="cp-card-head">
            <span className="cp-card-title">Rides waiting on the card</span>
            <span className="cp-hint">Booked and not done yet. Held the day before, charged when the ride ends.</span>
          </div>
          {rides.length === 0 ? (
            <div className="cp-empty">No rides booked on the card right now.</div>
          ) : (
            <div className="cp-table-wrap">
              <table className="cp-table">
                <thead>
                  <tr><th>Rider</th><th>Pickup</th><th className="cp-num">Fare</th><th>Card</th><th>Deadline</th></tr>
                </thead>
                <tbody>
                  {rides.map((r) => {
                    const bad = r.state === "card_declined" || r.state === "no_card";
                    return (
                      <tr key={r.id}>
                        <td className="cp-who">{r.rider ?? "A rider"}</td>
                        <td className="cp-muted cp-nowrap">{dayTime(r.pickup_at)}</td>
                        <td className="cp-num">{money(r.total_cents)}</td>
                        <td className={bad ? "cp-nowrap" : "cp-muted cp-nowrap"}>
                          {bad && <span className="cp-dot" style={{ background: "var(--red)", marginRight: 6 }} />}
                          {r.state === "card_declined" ? "Declined"
                            : r.state === "no_card" ? "No card"
                            : r.state === "held" ? "Held"
                            : r.hold_at ? `Held on ${day(r.hold_at)}` : "Held the day before"}
                        </td>
                        <td className={bad ? "cp-who cp-nowrap" : "cp-muted"}>{bad && r.deadline ? dayTime(r.deadline) : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");
function subscribeDark(on: () => void) {
  const m = darkQuery();
  m.addEventListener("change", on);
  return () => m.removeEventListener("change", on);
}

function CardElements({ stripeAccount, children }: { stripeAccount: string; children: React.ReactNode }) {
  const stripe = useMemo(() => stripeFor(stripeAccount), [stripeAccount]);
  // The page follows the system's light/dark, so the form does too.
  const dark = useSyncExternalStore(subscribeDark, () => darkQuery().matches, () => false);
  const appearance: Appearance = {
    theme: dark ? "night" : "stripe",
    variables: { colorPrimary: "#2f5be0", borderRadius: "8px", fontSizeBase: "14px" },
  };
  return (
    <Elements
      key={dark ? "dark" : "light"}
      stripe={stripe}
      options={{ mode: "setup", currency: "cad", allowedPaymentMethodTypes: ["card"], appearance }}
    >
      {children}
    </Elements>
  );
}

function CardForm({
  supabase, accountId, company, saveLabel, onSaved,
}: {
  supabase: SupabaseClient;
  accountId: string;
  company: string;
  saveLabel: string;
  onSaved: (text: string, bad?: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);

  async function save() {
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);
    try {
      const { error: invalid } = await elements.submit();
      if (invalid) return setError(invalid.message ?? "Check the card details.");

      const { data: setup, error: setupErr } = await supabase.functions.invoke("account-card", {
        body: { action: "setup", account_id: accountId },
      });
      if (setupErr || !setup?.ok) {
        return setError(SAVE_ERRORS[setup?.code] ?? RETRY_ERRORS[setup?.code] ?? "We couldn't start saving the card. Try again.");
      }
      // The key and the project must be from the same environment (test with
      // dev, live with prod); a mismatch would fail inside Stripe.js anyway.
      if (Boolean(setup.livemode) !== PK.startsWith("pk_live_")) {
        return setError("This page is set up with the wrong Stripe key for this environment. Tell Vellon.");
      }
      const { error: confirmErr, setupIntent } = await stripe.confirmSetup({
        elements,
        clientSecret: setup.client_secret,
        redirect: "if_required",
        confirmParams: { return_url: window.location.href },
      });
      if (confirmErr || !setupIntent) {
        return setError(confirmErr?.message ?? "The card couldn't be saved. Try again.");
      }

      const { data: rec, error: recErr } = await supabase.functions.invoke("account-card", {
        body: { action: "record", account_id: accountId, setup_intent_id: setupIntent.id },
      });
      if (recErr || !rec?.ok) {
        return setError(SAVE_ERRORS[rec?.code] ?? "We couldn't save the card. Try again.");
      }
      elements.getElement("payment")?.clear();
      const held = rec.due > 0
        ? ` ${rec.held} of ${rec.due} waiting ${rec.due === 1 ? "ride is" : "rides are"} now held on it.`
        : "";
      if (rec.declined) {
        onSaved(`Card saved, but the bank declined it for a waiting ride${rec.declined.code && BANK_SAYS[rec.declined.code] ? ` (${BANK_SAYS[rec.declined.code]})` : ""}. See above.`, true);
      } else {
        onSaved(`Card saved.${held}`);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cp-card-form">
      <PaymentElement
        onChange={(e) => setComplete(e.complete)}
        options={{ wallets: { applePay: "never", googlePay: "never", link: "never" } }}
      />
      {error && <div className="cp-error" role="alert">{error}</div>}
      <div className="cp-hint">
        Saved with Stripe on {company}&apos;s account. Vellon and {company}{" "}never see the full number. There&apos;s
        always one card here; to stop paying by card, ask {company}.
      </div>
      <div className="cp-card-save">
        <button className="cp-btn cp-btn-primary" onClick={save} disabled={!stripe || busy || !complete}>
          {busy ? "Saving…" : saveLabel}
        </button>
      </div>
    </div>
  );
}
