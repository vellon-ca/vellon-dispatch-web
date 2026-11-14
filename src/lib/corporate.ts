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
};

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
