import Link from "next/link";

/* The Vellon mark (the V and its square, as in vellon.ca's icon) beside the
   product name. Links to this site's home; the footer links to vellon.ca. */
export function Wordmark() {
  return (
    <Link href="/" aria-label="Vellon Dispatch home" className="inline-flex items-center gap-2.5 whitespace-nowrap">
      <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[var(--ink)]">
        <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
          <path d="M17 18 L31 43 L45 18" stroke="#fff" strokeWidth="6" strokeLinecap="square" />
          <rect x="46" y="40" width="7" height="7" fill="#fff" />
        </svg>
      </span>
      <span className="font-display text-[1.0625rem] font-bold">
        Vellon <span className="font-medium text-fg-2">Dispatch</span>
      </span>
    </Link>
  );
}
