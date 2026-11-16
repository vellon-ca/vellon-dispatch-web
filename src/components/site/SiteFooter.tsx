import Link from "next/link";
import { PRODUCT_PAGES, TOP_PAGES } from "@/lib/nav";
import { CONTACT_URL, DASHBOARD_URL, PRIVACY_URL, TERMS_URL, VELLON_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-[77.5rem] px-4 pb-12 pt-24 sm:px-6">
      <div className="grid grid-cols-2 gap-8 text-sm md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-[1.0625rem] font-bold">Vellon Dispatch</p>
          <p className="mt-2 leading-relaxed text-fg-3">
            Dispatch software for taxi companies.{" "}
            <a href={VELLON_URL} className="underline underline-offset-2 hover:text-[var(--accent)]">
              A Vellon product.
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="text-fg-3">Product</p>
          {PRODUCT_PAGES.map((p) => (
            <Link key={p.href} href={p.href} className="hover:text-[var(--accent)]">
              {p.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="text-fg-3">Company</p>
          {TOP_PAGES.map((p) => (
            <Link key={p.href} href={p.href} className="hover:text-[var(--accent)]">
              {p.label}
            </Link>
          ))}
          <a href={`${VELLON_URL}/about`} className="hover:text-[var(--accent)]">
            About Vellon
          </a>
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="text-fg-3">Help</p>
          <a href={CONTACT_URL} className="hover:text-[var(--accent)]">Contact</a>
          <a href={DASHBOARD_URL} className="hover:text-[var(--accent)]">Sign in</a>
          <a href={PRIVACY_URL} className="hover:text-[var(--accent)]">Privacy</a>
          <a href={TERMS_URL} className="hover:text-[var(--accent)]">Terms</a>
        </div>
      </div>
      <p className="mt-16 border-t border-rule pt-6 text-[0.8125rem] text-fg-3">
        © {new Date().getFullYear()} Vellon Inc.
      </p>
    </footer>
  );
}
