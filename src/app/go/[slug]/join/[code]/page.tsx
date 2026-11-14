import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RESERVED_SLUGS } from "@/lib/app";
import { getCompany, isSlugShaped } from "@/lib/companies";
import { StoreButtons } from "@/components/go/StoreButtons";
import { GetTheApp } from "@/components/go/GetTheApp";

/* go.vellon.ca/<slug>/join/<code>: a business account's join link, made in
   the manager portal. With the app installed the phone opens the app, which
   asks the person to confirm (mgcj-app useIncomingLinks); this page is what
   someone WITHOUT the app sees.

   It names the taxi company only, never the business account: the account's
   name is read by the signed-in app (ba_peek_join_code), and a link pasted
   somewhere public should not tell strangers who holds an account. The code
   is checked for shape only, for the same reason. */

type Props = { params: Promise<{ slug: string; code: string }> };

/* ba_new_join_code(): 10 characters, no 0/O/1/I. Either case. */
const CODE_SHAPE = /^[A-HJ-NP-Za-hj-np-z2-9]{10}$/;

function normalise(raw: string): string | null {
  const slug = raw.trim().toLowerCase();
  if (!isSlugShaped(slug) || RESERVED_SLUGS.has(slug)) return null;
  return slug;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = normalise((await params).slug);
  const company = slug ? await getCompany(slug) : null;
  return { title: company ? `Join a business account — ${company.name}` : "Get the app" };
}

export default async function JoinLink({ params }: Props) {
  const { slug: rawSlug, code } = await params;
  const slug = normalise(rawSlug);
  if (!slug || !CODE_SHAPE.test(code.trim())) notFound();

  const company = await getCompany(slug);
  if (!company) return <GetTheApp />;

  return (
    <>
      <p className="label">{company.name}</p>
      <h1 className="display mt-3 text-[1.9rem] leading-tight">Join a business account</h1>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-fg-2">
        You&rsquo;ve been sent a link to bill work rides with {company.name} to
        a business account. The business sees only the rides you bill to it,
        never your personal rides.
      </p>

      <ol className="mt-8 flex flex-col gap-4 text-[0.9375rem] leading-relaxed">
        <li className="flex gap-3">
          <span className="label mt-[0.2rem] w-4 shrink-0">1</span>
          <span>Get the app and sign up with {company.name}.</span>
        </li>
        <li className="flex gap-3">
          <span className="label mt-[0.2rem] w-4 shrink-0">2</span>
          <span>
            Open the link you were sent again. It opens in the app, which asks
            you to confirm.
          </span>
        </li>
      </ol>

      <div className="mt-10">
        <StoreButtons slug={company.slug} />
      </div>
    </>
  );
}
