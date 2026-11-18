/* The business account manager portal (corporate.vellon.ca).

   A manager signs in as an IDENTITY on the mgcj Supabase project: an auth user
   holding their email and no profiles row. Everything they can do goes through
   the ba_* SECURITY DEFINER functions, which recognise them by that email
   (ba_manager_email()); see mgcj-app/.claude/notes/business-accounts-design.md.

   The browser needs the project URL and publishable key, so these are
   NEXT_PUBLIC_ variables, separate from the link pages' server-only pair. Until
   the portal goes live they carry DEV values in Preview and locally, and are
   unset in Production, which makes the portal say it is not available yet
   rather than talk to the production database. */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let client: SupabaseClient | null = null;

export function corporateClient(): SupabaseClient | null {
  if (!URL || !KEY) return null;
  if (!client) {
    client = createClient(URL, KEY, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: "vellon-corporate-auth" },
    });
  }
  return client;
}

export type ManagedAccount = {
  account_id: string;
  account_name: string;
  account_status: "active" | "suspended";
  join_domain: string | null;
  company_name: string;
  company_slug: string;
  manager_id: string;
  /** The organisation it sits under; null until its manager first places it. */
  business_id: string | null;
  business_name: string | null;
};

/** ba_card_view: the account's card and what the Card page leads with. */
export type CardReason = "no_card" | "soft" | "hard" | "budget" | "auth";
export type CardView = {
  ok: true;
  billing_mode: "card" | "invoice" | null;
  time_zone: string;
  company_name?: string;
  stripe_account?: string | null;
  cards_active?: boolean;
  card?: {
    brand: string | null; last4: string | null;
    exp_month: number | null; exp_year: number | null;
    added_at: string | null; added_by: string | null;
  } | null;
  state?: "soft" | "hard" | "auth" | null;
  reason?: CardReason | null;
  decline_code?: string | null;
  declined_at?: string | null;
  retry_at?: string | null;
  last_attempt_at?: string | null;
  rides?: {
    id: string; ride_ref: string | null; rider: string | null; pickup_at: string; total_cents: number;
    state: "card_declined" | "no_card" | "held" | "not_due";
    hold_at: string | null; deadline: string | null;
  }[];
};

export type Business = {
  id: string;
  name: string;
  billing_address: string | null;
  contact_phone: string | null;
  account_count: number;
};

export type Application = {
  id: string;
  business_id: string;
  business_name: string;
  company_name: string;
  company_slug: string;
  status: "pending" | "approved" | "declined" | "withdrawn";
  created_at: string;
  decided_at: string | null;
  decline_reason: string | null;
  account_id: string | null;
};

export type CompanyPage = { name: string; open: boolean; phone: string | null; slug: string };

export const RIDES_PER_MONTH: { value: string; label: string }[] = [
  { value: "under_20", label: "Fewer than 20" },
  { value: "20_50", label: "20 to 50" },
  { value: "50_100", label: "50 to 100" },
  { value: "100_250", label: "100 to 250" },
  { value: "over_250", label: "More than 250" },
];

export type Team = { id: string; name: string };

export type Member = {
  id: string;
  status: "invited" | "requested" | "active";
  role: "rider" | "booker";
  team_id: string | null;
  source: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  pending_phone: string | null;
  pending_email: string | null;
  created_at: string;
  responded_at: string | null;
};

export type JoinCode = {
  id: string;
  code: string;
  requires_approval: boolean;
  uses: number;
  max_uses: number | null;
  expires_at: string | null;
  created_at: string;
};

export type Entry = { phone: string } | { email: string };

/* One pasted line or comma-separated piece -> what ba_add_members expects.
   A phone without a country code is read as North American (+1), which is what
   the hint under the box says. Anything that is not a clean number is sent as
   typed, so the server's answer for it is bad_phone, shown next to it. */
export function parseEntry(raw: string): Entry {
  const s = raw.trim();
  if (s.includes("@")) return { email: s.toLowerCase() };
  const digits = s.replace(/\D/g, "");
  if (s.startsWith("+")) return { phone: "+" + digits };
  if (digits.length === 10) return { phone: "+1" + digits };
  if (digits.length === 11 && digits.startsWith("1")) return { phone: "+" + digits };
  return { phone: s };
}

export function splitEntries(text: string): string[] {
  return text
    .split(/[\n,;]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export function formatPhone(p: string | null): string {
  if (!p) return "";
  const m = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(p);
  return m ? `+1 ${m[1]} ${m[2]} ${m[3]}` : p;
}

export function joinLink(slug: string, code: string): string {
  return `https://go.vellon.ca/${slug}/join/${code}`;
}

/* ── statements ──────────────────────────────────────────────────────────
   Times are shown on the TAXI COMPANY's clock (the statement carries its
   zone), never the browser's: a pickup at 11:50 pm on the 31st must read as
   the 31st wherever the manager is. A month is a calendar DATE ('2026-10-01'),
   so it is formatted in UTC, where its midnight is still that day. */

export type StatementStatus = "owing" | "part_paid" | "paid" | "void";

export const STATEMENT_STATUS: Record<StatementStatus, { label: string; color: string }> = {
  owing: { label: "Owing", color: "var(--amber)" },
  part_paid: { label: "Part paid", color: "var(--amber)" },
  paid: { label: "Paid", color: "var(--green)" },
  void: { label: "Withdrawn", color: "var(--text-3)" },
};

export type StatementRow = {
  id: string;
  month: string;
  number: string;
  time_zone: string;
  status: StatementStatus;
  issued_at: string;
  ride_count: number;
  total_cents: number;
  /** Recorded payments + the card lines. */
  paid_cents: number;
  /** Lines already charged to the business's card; never owed. */
  card_paid_cents?: number;
  last_paid_on: string | null;
  voided_at: string | null;
  void_reason: string | null;
};

export type StatementLine = {
  id: string;
  ride_ref: string | null;
  pickup_at: string;
  ride_month: string;
  rider_name: string;
  team_name: string | null;
  pickup_address: string | null;
  dropoff_address: string | null;
  fare_cents: number;
  booking_fee_cents: number;
  total_cents: number;
  tax_rate_percent: number | null;
  /** card = already charged to the business's card (amounts net of any refund at issue). */
  kind?: "invoice" | "card";
  refunded_cents?: number;
  card_last4?: string | null;
};

export type StatementDetail = {
  statement: StatementRow & {
    account_id: string;
    account_name: string;
    payment_terms: string | null;
    company_name: string;
    company_address: string | null;
    company_email: string | null;
    company_phone: string | null;
    hst_number: string | null;
    tax_label: string;
    fares_cents: number;
    booking_fees_cents: number;
  };
  lines: StatementLine[];
  payments: { id: string; amount_cents: number; received_on: string; note: string | null }[];
};

/** "Paid by card" for a month that was all card; "Owing" while only the card
    lines are paid (nothing has been paid on the rest yet). */
export function statementStatusLabel(r: Pick<StatementRow, "status" | "total_cents" | "paid_cents" | "card_paid_cents">): string {
  const card = r.card_paid_cents ?? 0;
  if (r.status === "paid" && card >= r.total_cents) return "Paid by card";
  if (r.status === "part_paid" && r.paid_cents <= card) return STATEMENT_STATUS.owing.label;
  return STATEMENT_STATUS[r.status].label;
}

/** A card line's mark: "Card ••4242". */
export function cardMark(l: StatementLine): string | null {
  return l.kind === "card" ? (l.card_last4 ? `Card ••${l.card_last4}` : "Card") : null;
}

export function money(cents: number): string {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(Number(cents) / 100);
}

export function zonedDate(iso: string, timeZone: string, opts: Intl.DateTimeFormatOptions): string {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00Z`) : new Date(iso);
  return d.toLocaleString("en-CA", { ...opts, timeZone });
}

export function monthName(month: string, style: "long" | "short" = "long"): string {
  return zonedDate(month, "UTC", style === "long" ? { month: "long", year: "numeric" } : { month: "short" });
}

/* The same columns as the CSV attached to the statement email. A cell a
   spreadsheet would run as a formula is prefixed with an apostrophe: names and
   addresses come from riders. */
export function statementCsv(d: StatementDetail): string {
  const cell = (v: string | number | null) => {
    let s = v == null ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const s = d.statement;
  const head = "Statement,Ride,Pickup,Month,Rider,Team,From,To,Fare,Booking fee,Total,Tax rate,Paid by,Refunded";
  const rows = d.lines.map((l) =>
    [
      s.number, l.ride_ref,
      zonedDate(l.pickup_at, s.time_zone, { dateStyle: "medium", timeStyle: "short" }),
      l.ride_month.slice(0, 7), l.rider_name, l.team_name ?? "", l.pickup_address, l.dropoff_address,
      (l.fare_cents / 100).toFixed(2), (l.booking_fee_cents / 100).toFixed(2), (l.total_cents / 100).toFixed(2),
      l.tax_rate_percent == null ? "" : `${Number(l.tax_rate_percent)}%`,
      l.kind === "card" ? ["Card", l.card_last4].filter(Boolean).join(" ") : "Statement",
      (l.refunded_cents ?? 0) > 0 ? ((l.refunded_cents ?? 0) / 100).toFixed(2) : "",
    ].map(cell).join(","),
  );
  return "\uFEFF" + [head, ...rows].join("\r\n");
}
