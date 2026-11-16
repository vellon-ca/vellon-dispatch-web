import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Vellon Dispatch costs a share of each fare, the same on cash and card. Nothing per vehicle, nothing per seat: a quiet month costs less.",
  alternates: { canonical: "/pricing" },
};

/* The model only. The rate itself is agreed per company and is not
   published (Victor, 2026-11-16). */
const POINTS = [
  {
    title: "A share of each fare",
    body: "You pay a percentage of the fares your fleet carries. No rides, no bill.",
  },
  {
    title: "The same on cash and card",
    body: "One rate for both, so no one has a reason to call a card ride cash.",
  },
  {
    title: "Nothing per vehicle or per seat",
    body: "Add a car for the summer and take it off for the winter. Add dispatchers as you need them.",
  },
  {
    title: "Card: taken at the ride",
    body: "On a card fare, Vellon's share is deducted when the fare is charged. Nothing to invoice or chase.",
  },
  {
    title: "Cash: one monthly invoice",
    body: "Cash fares are totalled and invoiced once a month, at the same rate.",
  },
  {
    title: "Everything included",
    body: "The board, the passenger app and the driver app, with every update as it ships.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="mx-auto max-w-[77.5rem] px-4 pt-14 sm:px-6 md:pt-20">
        <Reveal>
          <p className="text-sm font-semibold text-[var(--accent)]">Pricing</p>
          <h1 className="font-display h-page mt-4 max-w-[16ch] text-balance">
            You pay when you drive. Not per car, not per seat.
          </h1>
          <p className="mt-6 max-w-[50ch] text-lg leading-relaxed text-fg-2 text-pretty">
            Vellon Dispatch costs a share of each fare. The cost rises and falls with the work, so a quiet month
            costs less.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[77.5rem] px-4 pt-20 sm:px-6">
        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {POINTS.map((p) => (
            <StaggerItem key={p.title} className="rounded-3xl bg-surface p-7">
              <h2 className="text-lg font-semibold">{p.title}</h2>
              <p className="mt-2 leading-relaxed text-fg-2">{p.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-[77.5rem] px-4 pt-24 sm:px-6 md:pt-32">
        <Reveal>
          <div className="grid grid-cols-1 items-end gap-10 rounded-[2rem] bg-[var(--ink)] p-8 text-white md:grid-cols-2 md:p-14">
            <h2 className="font-display text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.02]">
              Ask for your rate.
            </h2>
            <div>
              <p className="leading-relaxed text-[var(--ink-2)]">
                Tell us about your fleet: how many cars, roughly how many rides, and how many are paid by card.
                We&rsquo;ll come back with a rate.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/demo" className="btn btn-light">
                  Tell us about your fleet
                </Link>
                <Link href="/faq" className="btn border border-white/30 text-white hover:border-white">
                  Read the FAQ
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
