"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { CONTACT_URL, DASHBOARD_URL } from "@/lib/site";

/* Short enough that there is no menu sheet: on a phone the bar is the logo
   and "Book a demo". When this grows, bring back the sheet from
   vellon-webpage's Navbar rather than letting the row wrap. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "border-b border-rule bg-bg/92 backdrop-blur-[2px]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-[86rem] items-center justify-between gap-4 px-4 py-5 sm:px-6 md:px-10">
        <Logo />

        <nav className="flex items-center gap-4 whitespace-nowrap md:gap-8">
          {/* Hidden through a wrapper: `.link-draw` sets its own display in
              globals.css, outside Tailwind's layers, so it beats `hidden` on
              the link itself. Sign in drops off a phone's bar too; the hero
              and the footer both carry it. */}
          <span className="hidden md:inline">
            <a
              href="#films"
              className="link-draw text-[0.8125rem] font-medium text-fg-2 transition-colors hover:text-fg"
            >
              Films
            </a>
          </span>
          <span className="hidden sm:inline">
            <a
              href={DASHBOARD_URL}
              className="link-draw text-[0.8125rem] font-medium text-fg-2 transition-colors hover:text-fg"
            >
              Sign in
            </a>
          </span>
          <a
            href={CONTACT_URL}
            className="group inline-flex items-center gap-2 border-b border-fg pb-[3px] text-[0.8125rem] font-semibold text-fg"
          >
            Book a demo
            <span className="transition-transform duration-400 group-hover:translate-x-[3px]">
              &rarr;
            </span>
          </a>
        </nav>
      </div>
    </header>
  );
}
