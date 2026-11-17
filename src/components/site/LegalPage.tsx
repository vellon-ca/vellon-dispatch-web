import Link from "next/link";
import { renderLegalDoc } from "@/lib/legalDoc";

/* A legal document in this site's look, rendered at build time from
   content/legal/<doc>.md.

   Those four files are byte-identical copies of vellon-webpage's
   content/legal/. vellon.ca/privacy and /terms stay the canonical addresses
   until the app in review is approved (the app and the store listings link
   there), so every page here sets its canonical to the vellon.ca page and is
   left out of this site's sitemap. Until the move, an edit to the text goes
   into BOTH repos in the same change. */
export function LegalPage({ doc, lang }: { doc: "privacy-policy" | "terms-of-service"; lang: "en" | "fr" }) {
  const html = renderLegalDoc(lang === "fr" ? `${doc}.fr` : doc);
  const path = doc === "privacy-policy" ? "privacy" : "terms";
  const other = lang === "fr" ? `/${path}` : `/fr/${path}`;

  return (
    <section className="mx-auto max-w-[77.5rem] px-4 pb-8 pt-14 sm:px-6 md:pt-20">
      <div className="flex items-baseline justify-between gap-6 border-b border-rule pb-5">
        <p className="text-sm font-semibold text-[var(--accent)]">{lang === "fr" ? "Mentions légales" : "Legal"}</p>
        <Link
          href={other}
          hrefLang={lang === "fr" ? "en" : "fr"}
          lang={lang === "fr" ? "en" : "fr"}
          className="text-sm text-fg-2 underline-offset-2 hover:text-[var(--accent)] hover:underline"
        >
          {lang === "fr" ? "English" : "Français"}
        </Link>
      </div>
      {/* No Reveal: someone sent here for one clause, often by an anchor, must
          see it at once. */}
      <article
        lang={lang === "fr" ? "fr-CA" : "en-CA"}
        className="legal-prose mt-10 md:mt-14"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}
