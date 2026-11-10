import type { Metadata } from "next";
import { PRIVACY_URL, TERMS_URL } from "@/lib/site";

/* The passenger side. A person here tapped a taxi company's link, so the page
   is about that company; Vellon appears only as the small print, the way the
   app itself presents it (the company rides, Vellon makes the software). */

export const metadata: Metadata = {
  metadataBase: new URL("https://go.vellon.ca"),
  /* Link pages for unlisted (pilot) companies must not surface in search. */
  robots: { index: false, follow: false },
};

export default function GoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-[24rem]">{children}</div>
      </main>
      <footer className="px-4 pb-8 text-center text-xs text-fg-3 sm:px-6">
        <p>Booking app by Vellon</p>
        <p className="mt-2 flex items-center justify-center gap-4">
          <a href={PRIVACY_URL} className="link-draw transition-colors hover:text-fg">
            Privacy
          </a>
          <span aria-hidden className="h-3 w-px bg-rule" />
          <a href={TERMS_URL} className="link-draw transition-colors hover:text-fg">
            Terms
          </a>
        </p>
      </footer>
    </>
  );
}
