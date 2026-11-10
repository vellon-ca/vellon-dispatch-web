import type { Metadata } from "next";

/* Where a student-discount email link ends up. The link itself points at the
   `confirm-student-verification` Edge Function, which does the work and then
   redirects here with `success=1` or not, and a message already in the
   passenger's own language. This page only shows the outcome.

   It used to be `verify.html` on the dispatch dashboard: a passenger page on
   the staff-only site, which is why it moved.

   The message arrives in the URL, so anyone can put words on this page by
   crafting a link. React escapes it (no markup), and it is capped in length;
   replacing the free text with message codes the page translates itself would
   close it fully. */

export const metadata: Metadata = {
  title: "Student verification",
};

const MAX_MESSAGE = 240;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Verify({ searchParams }: Props) {
  const params = await searchParams;
  const success = params.success === "1";
  const raw = typeof params.message === "string" ? params.message : "";
  const message =
    raw.slice(0, MAX_MESSAGE) ||
    (success
      ? "Your student discount is now active. You can close this page and return to the app."
      : "Something went wrong. Please try again.");

  return (
    <div className="text-center">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
          success ? "bg-[#1D9E75]" : "bg-surface"
        }`}
      >
        {success ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </div>
      <h1 className="sr-only">{success ? "Verified" : "Not verified"}</h1>
      <p
        className={`mt-6 text-[1rem] leading-relaxed ${
          success ? "text-fg" : "text-[#F87171]"
        }`}
      >
        {message}
      </p>
    </div>
  );
}
