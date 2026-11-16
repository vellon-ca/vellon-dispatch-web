import type { Metadata } from "next";
import { DemoForm } from "@/components/site/DemoForm";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "Tell us about your taxi fleet and we'll show you Vellon Dispatch on your own streets: the board, the passenger app and the driver app.",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return (
    <section className="mx-auto grid max-w-[77.5rem] grid-cols-1 gap-12 px-4 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="text-sm font-semibold text-[var(--accent)]">Book a demo</p>
        <h1 className="font-display h-page mt-4 max-w-[12ch] text-balance">See it run your fleet.</h1>
        <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-fg-2 text-pretty">
          A few questions about your company, so the demo shows the parts that matter to you. We&rsquo;ll get back
          to you within one business day to set a time.
        </p>
        <ul className="mt-8 flex flex-col gap-3 text-[0.9375rem] text-fg-2">
          {["The board on your own streets", "The passenger and driver apps", "How pricing would work for you"].map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span aria-hidden="true" className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-surface text-[var(--accent)]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="m5 12 5 5 9-10" />
                </svg>
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <DemoForm />
    </section>
  );
}
