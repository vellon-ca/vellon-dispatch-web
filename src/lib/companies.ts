/* Company lookups for the link pages, against PROD Supabase with the public
   (publishable) key. `shared_app_company` is the same anon-callable RPC the
   app's picker uses: it resolves unlisted companies too, so a pilot's link
   works while the company never appears in search. */

export type Company = {
  slug: string;
  name: string;
  brandColor: string | null;
  logoUrl: string | null;
  city: string | null;
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

const SLUG_SHAPE = /^[a-z0-9][a-z0-9-]{0,62}$/;

export function isSlugShaped(s: string): boolean {
  return SLUG_SHAPE.test(s);
}

export async function getCompany(slug: string): Promise<Company | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY are not set");
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/shared_app_company`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_slug: slug }),
    /* A brand change (logo, colour) shows within five minutes; nothing here
       is worth a database call per visit. */
    next: { revalidate: 300 },
  });
  /* A failed lookup is an outage, not "no such company": throw, so the page
     errors instead of telling a passenger their taxi company does not exist. */
  if (!res.ok) throw new Error(`shared_app_company: ${res.status}`);
  const rows = (await res.json()) as Array<{
    slug: string;
    name: string;
    brand_color: string | null;
    logo_path: string | null;
    service_city: string | null;
  }>;
  const row = rows[0];
  if (!row) return null;
  return {
    slug: row.slug,
    name: row.name,
    brandColor: row.brand_color,
    logoUrl: row.logo_path
      ? `${SUPABASE_URL}/storage/v1/object/public/company-brand/${row.logo_path}`
      : null,
    city: row.service_city,
  };
}
