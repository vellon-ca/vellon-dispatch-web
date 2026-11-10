import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RESERVED_SLUGS } from "@/lib/app";
import { getCompany, isSlugShaped } from "@/lib/companies";
import { StoreButtons } from "@/components/go/StoreButtons";
import { GetTheApp } from "@/components/go/GetTheApp";

/* go.vellon.ca/<slug>: one taxi company's link. With the app installed the
   phone opens the app straight to the company (universal link / App Link) and
   this page is never shown; it is what someone WITHOUT the app sees. */

type Props = { params: Promise<{ slug: string }> };

function normalise(raw: string): string | null {
  /* Next has already decoded the segment; decoding again would throw on a
     literal "%" and turn a typo into a 500. */
  const slug = raw.trim().toLowerCase();
  if (!isSlugShaped(slug) || RESERVED_SLUGS.has(slug)) return null;
  return slug;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = normalise((await params).slug);
  const company = slug ? await getCompany(slug) : null;
  if (!company) return { title: "Get the app" };
  return {
    title: `${company.name} — book a ride`,
    description: `Book a ride with ${company.name}.`,
  };
}

export default async function CompanyLink({ params }: Props) {
  const slug = normalise((await params).slug);
  if (!slug) notFound();

  const company = await getCompany(slug);
  if (!company) return <GetTheApp />;

  const colour = company.brandColor ?? "#2a2a2a";

  return (
    <>
      <div
        className="flex aspect-[2/1] w-full items-center justify-center"
        style={{ backgroundColor: colour }}
      >
        {company.logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={company.logoUrl}
            alt=""
            className="max-h-[60%] max-w-[70%] object-contain"
          />
        ) : (
          <span
            className="display px-6 text-center text-[1.6rem] leading-tight"
            style={{ color: onColour(colour) }}
          >
            {company.name}
          </span>
        )}
      </div>

      <h1 className="display mt-8 text-[1.9rem] leading-tight">{company.name}</h1>
      {company.city && <p className="label mt-2">{company.city}</p>}
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-fg-2">
        Book a ride, see your driver on the map and pay by card or cash. Get
        the app and it opens on {company.name}.
      </p>

      <div className="mt-10">
        <StoreButtons slug={company.slug} />
      </div>
    </>
  );
}

/* Black or white text on the company colour, by WCAG relative luminance:
   a yellow company gets dark text, a red one white. Same rule as the app's
   `onBrand`. */
function onColour(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return "#ffffff";
  const n = parseInt(m[1], 16);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const L =
    0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return (L + 0.05) / 0.05 > 1.05 / (L + 0.05) ? "#111111" : "#ffffff";
}
