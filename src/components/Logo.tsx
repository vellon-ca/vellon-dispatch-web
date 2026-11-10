import Link from "next/link";

/* The Vellon wordmark with the product name beside it. Home is this site's
   root, not vellon.ca: the "By Vellon" link in the footer is the way back. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-baseline gap-[0.45rem] whitespace-nowrap ${className}`}
      aria-label="Vellon Dispatch home"
    >
      <span className="text-[1.05rem] font-semibold tracking-[-0.03em] text-fg">
        Vellon
      </span>
      <span
        aria-hidden
        className="mb-[0.14rem] block h-[5px] w-[5px] bg-brass transition-transform duration-500 group-hover:translate-x-[3px]"
      />
      <span className="text-[1.05rem] font-medium tracking-[-0.02em] text-fg-2">
        Dispatch
      </span>
    </Link>
  );
}
