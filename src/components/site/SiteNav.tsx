"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PRODUCT_PAGES, TOP_PAGES } from "@/lib/nav";
import { DASHBOARD_URL } from "@/lib/site";
import { Wordmark } from "./Wordmark";

const ICONS: Record<string, React.ReactNode> = {
  "/board": (
    <>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 21h8M12 18v3" />
    </>
  ),
  "/passenger-app": (
    <>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  "/driver-app": (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v6M3 12h6M15 12h6" />
    </>
  ),
  "/payments": (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </>
  ),
};

export function ProductIcon({ href }: { href: string }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      {ICONS[href]}
    </svg>
  );
}

/* Desktop: a bar with a Product menu (opens on hover or click, closes on
   Escape, outside click and route change). Phone: a full-screen sheet. */
export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A navigation closes whatever was open (adjusted during render, React's
  // pattern for state that follows a changing value).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setProductOpen(false);
    setSheetOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProductOpen(false);
        setSheetOpen(false);
      }
    };
    const onDown = (e: MouseEvent) => {
      if (productRef.current && !productRef.current.contains(e.target as Node)) {
        setProductOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, []);

  // The page underneath must not scroll while the sheet covers it.
  useEffect(() => {
    document.documentElement.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [sheetOpen]);

  const openSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setProductOpen(true);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setProductOpen(false), 120);
  };

  const productActive = PRODUCT_PAGES.some((p) => p.href === pathname);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || productOpen
          ? "border-b border-rule bg-white/90 backdrop-blur-md"
          : "border-b border-transparent bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-[77.5rem] items-center justify-between gap-6 px-4 py-3.5 sm:px-6">
        <Wordmark />

        <nav aria-label="Main" className="hidden items-center gap-7 text-sm font-medium lg:flex">
          <div ref={productRef} className="relative" onMouseEnter={openSoon} onMouseLeave={closeSoon}>
            <button
              type="button"
              aria-expanded={productOpen}
              aria-controls="product-menu"
              onClick={() => setProductOpen((v) => !v)}
              className={`inline-flex min-h-[44px] items-center gap-1 transition-colors hover:text-[var(--accent)] ${
                productOpen || productActive ? "text-[var(--accent)]" : ""
              }`}
            >
              Product
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform duration-200 ${productOpen ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              id="product-menu"
              hidden={!productOpen}
              className="absolute left-1/2 top-full w-[40rem] -translate-x-1/2 pt-3"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_13rem] gap-2 rounded-2xl border border-rule bg-white p-4 shadow-[0_24px_60px_-20px_rgba(11,11,12,0.25)]">
                {PRODUCT_PAGES.map((p, i) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className={`flex gap-3.5 rounded-xl p-3.5 transition-colors hover:bg-surface ${
                      pathname === p.href ? "bg-surface" : ""
                    } ${i >= 2 ? "row-start-2" : ""}`}
                  >
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] border border-rule bg-white text-fg">
                      <ProductIcon href={p.href} />
                    </span>
                    <span>
                      <span className="block text-[0.9375rem] font-semibold text-fg">{p.label}</span>
                      <span className="mt-0.5 block text-[0.8125rem] leading-snug text-fg-3">{p.blurb}</span>
                    </span>
                  </Link>
                ))}
                <Link
                  href="/demo"
                  className="col-start-3 row-span-2 row-start-1 flex flex-col justify-end overflow-hidden rounded-xl bg-[var(--ink)] p-4 text-white"
                >
                  <span className="text-[0.9375rem] font-semibold">Book a demo</span>
                  <span className="mt-1 text-[0.8125rem] text-[var(--ink-2)]">See the board on your own streets</span>
                </Link>
              </div>
            </div>
          </div>

          {TOP_PAGES.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className={`transition-colors hover:text-[var(--accent)] ${pathname === p.href ? "text-[var(--accent)]" : ""}`}
            >
              {p.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={DASHBOARD_URL} className="hidden px-3 py-2 text-sm font-medium transition-colors hover:text-[var(--accent)] sm:inline">
            Sign in
          </a>
          <Link href="/demo" className="btn btn-dark hidden !min-h-[40px] !px-[1.125rem] !py-2 !text-sm sm:inline-flex">
            Book a demo
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={sheetOpen}
            aria-controls="site-sheet"
            onClick={() => setSheetOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-rule-2 lg:hidden"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Phone sheet */}
      <div
        id="site-sheet"
        hidden={!sheetOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden"
      >
        <div className="flex items-center justify-between border-b border-rule px-4 py-3.5 sm:px-6">
          <Wordmark />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setSheetOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-rule-2"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <nav aria-label="Menu" className="flex flex-1 flex-col overflow-y-auto px-4 pb-4 sm:px-6">
          <p className="mb-1 mt-5 text-xs text-fg-3">Product</p>
          {PRODUCT_PAGES.map((p) => (
            <Link key={p.href} href={p.href} className="py-3 text-xl font-semibold">
              {p.label}
            </Link>
          ))}
          <span className="my-3 h-px bg-rule" />
          {TOP_PAGES.map((p) => (
            <Link key={p.href} href={p.href} className="py-3 text-xl font-semibold">
              {p.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2.5 p-4 sm:px-6">
          <Link href="/demo" className="btn btn-accent w-full">
            Book a demo
          </Link>
          <a href={DASHBOARD_URL} className="btn btn-outline w-full">
            Sign in
          </a>
        </div>
      </div>
    </header>
  );
}
