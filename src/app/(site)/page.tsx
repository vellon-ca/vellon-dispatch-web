import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { CTA } from "@/components/CTA";
import { DispatchLoop } from "@/components/dispatch/DispatchLoop";
import { SurfacePair } from "@/components/dispatch/SurfacePair";
import { Films } from "@/components/dispatch/Films";
import { CONTACT_URL, DASHBOARD_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Vellon Dispatch — the operating platform for modern taxi fleets",
  description:
    "The operating platform for modern taxi fleets — the board, the cars, the fares, and a record of every ride that outlives the shift.",
  openGraph: {
    title: "Vellon Dispatch",
    description:
      "The operating platform for modern taxi fleets — the board, the cars, the fares, and a record of every ride.",
    url: "https://dispatch.vellon.ca",
  },
};

const SPEC = [
  { term: "Built for", detail: "Taxi and livery fleets, 3 cars to 300" },
  { term: "Surfaces", detail: "Dispatch board, passenger app, driver app" },
  { term: "What it costs", detail: "A share of fares — the same on cash and card" },
];

const SURFACES = [
  {
    index: "01",
    name: "The board",
    body: "Every car and every ride on one screen. Auto-assign takes the nearest free driver by real drive time, and dispatch can override it at any point in the ride.",
  },
  {
    index: "02",
    name: "The passenger app",
    body: "Booking with the fare known up front, the driver, car and plate on screen before pickup, and the car moving live on the map. Card or cash, scheduled or now.",
  },
  {
    index: "03",
    name: "The driver app",
    body: "Offers with a countdown, turn-by-turn to the pickup, and a close-out that captures the card automatically or takes the cash figure in two taps.",
  },
];

const TERMS = [
  {
    index: "01",
    title: "The same rate on cash and card",
    body: "Card fares are collected at the end of the ride; cash is invoiced monthly at the identical rate — so no one has any reason to call a card ride cash.",
  },
  {
    index: "02",
    title: "Nothing per vehicle, nothing per seat",
    body: "Add a car in the summer and take it off in the winter. The cost moves with the work, not with the size of the yard.",
  },
  {
    index: "03",
    title: "Card money lands on its own",
    body: "Fares settle to the fleet's own account on a schedule, with the platform's share taken at the time of the ride. No invoicing chase, no month-end reconciliation.",
  },
];

export default function DispatchPage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="pt-32 pb-14 md:pt-40 md:pb-20">
        <div className="mx-auto max-w-[86rem] px-6 md:px-10">
          {/* Product masthead. The name of the product, and beside it the two
              doors into it — the same pair, under the same labels, as the
              closing band. A fleet arriving to start and a dispatcher arriving
              to work both find their way in without reaching the fold. Kept at
              label scale on purpose: it's a tier above the hero actions, not a
              third peer inside them, so "Book a demo" stays the primary ask. */}
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4 border-b border-rule pb-4">
              <p className="label">Vellon Dispatch</p>
              <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                <Link
                  href={CONTACT_URL}
                  className="group inline-flex items-center gap-2 border-b border-fg pb-[3px] text-[0.8125rem] font-semibold text-fg"
                >
                  Set up your fleet
                  <span className="transition-transform duration-400 group-hover:translate-x-[3px]">
                    &rarr;
                  </span>
                </Link>
                <a
                  href={DASHBOARD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw text-[0.8125rem] font-medium text-fg-2 transition-colors hover:text-fg"
                >
                  Sign in to your board
                  <span aria-hidden className="ml-1 text-fg-3">
                    &#8599;
                  </span>
                </a>
              </div>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 items-end gap-x-0 gap-y-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-16">
            <Reveal>
              <h1 className="display display-xl max-w-[15ch]">
                Run the whole fleet from one screen.
              </h1>
              <p className="lede mt-7 max-w-[48ch] text-pretty">
                The operating platform for modern taxi fleets — the board, the
                cars, the fares, and a record of every ride that outlives the
                shift.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href={CONTACT_URL}
                  className="group inline-flex items-center gap-2 border-b border-fg pb-1 text-sm font-semibold text-fg"
                >
                  Book a demo
                  <span className="transition-transform duration-400 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
                <a
                  href="#films"
                  className="link-draw text-sm text-fg-2 transition-colors hover:text-fg"
                >
                  Watch the films
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="grid grid-cols-1">
                {SPEC.map((s) => (
                  <div key={s.term} className="border-t border-rule py-3.5">
                    <dt className="label">{s.term}</dt>
                    <dd className="mt-1 text-[0.875rem] text-fg-2">{s.detail}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.18} className="mt-14">
            <figure>
              <video
                src="/media/board.mp4"
                poster="/media/board.jpg"
                muted
                loop
                autoPlay
                playsInline
                className="block h-auto w-full border border-rule-2 bg-surface"
              />
              <figcaption className="label mt-3 text-[0.625rem]">
                The board · recorded in a demonstration environment, figures
                illustrative
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ---------- FIG. 02 ---------- */}
      <section className="border-t border-rule bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-[86rem] px-6 md:px-10">
          <DispatchLoop>
            <p className="label">Fig. 02 — the dispatch loop</p>
            <h2 className="display display-lg mt-4">
              A ride is a loop, and paper never closes it.
            </h2>
            <p className="lede mt-6 text-pretty">
              A call comes in. The board places it, a car takes it, the ride
              runs and the fare settles. Then the record lands back on the
              board — searchable, printable, provable. That last leg is the one
              a paper book has never been able to do.
            </p>
          </DispatchLoop>
        </div>
      </section>

      {/* ---------- Three surfaces ---------- */}
      <section className="border-t border-rule py-20 md:py-28">
        <div className="mx-auto max-w-[86rem] px-6 md:px-10">
          <Reveal className="grid grid-cols-12 gap-y-5 pb-10 md:pb-14">
            <p className="label col-span-12 md:col-span-3">Three surfaces</p>
            <div className="col-span-12 md:col-span-6 md:col-start-4">
              <h2 className="display display-lg">
                One system, seen from three sides.
              </h2>
              <p className="lede mt-6 max-w-[46ch] text-pretty">
                Dispatch works a board. Passengers use an app that looks like
                every other app they have. Drivers get offers, navigation and a
                close-out that handles cash without a calculator.
              </p>
            </div>
          </Reveal>

          <Stagger className="border-t border-rule">
            {SURFACES.map((s) => (
              <StaggerItem key={s.index}>
                <div className="grid grid-cols-12 items-baseline gap-x-4 gap-y-2 border-b border-rule px-1 py-7 md:py-9">
                  <span className="numeral col-span-2 text-sm text-fg-3 md:col-span-1">
                    {s.index}
                  </span>
                  <span className="display display-md col-span-10 md:col-span-4">
                    {s.name}
                  </span>
                  <span className="col-span-12 max-w-[52ch] text-pretty text-[0.9375rem] leading-relaxed text-fg-2 md:col-span-7 md:col-start-6">
                    {s.body}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <SurfacePair />
        </div>
      </section>

      {/* ---------- The record ---------- */}
      <section className="border-t border-rule bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-[86rem] px-6 md:px-10">
          <Reveal className="grid grid-cols-12 gap-y-5 pb-10 md:pb-14">
            <p className="label col-span-12 md:col-span-3">The record</p>
            <div className="col-span-12 md:col-span-6 md:col-start-4">
              <h2 className="display display-lg">The book they&rsquo;ve never had.</h2>
              <p className="lede mt-6 max-w-[46ch] text-pretty">
                A fleet running on paper can&rsquo;t answer simple questions.
                Who drove that fare on the 4th? What did we take last month?
                Did that ride happen at all? Every ride Dispatch handles is
                written down the moment it closes, and stays queryable,
                exportable and printable long after the shift.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/records.jpg"
                alt="The ride history view: every ride grouped by month, with date, passenger, driver, pickup, drop-off, fare, status and payment, and a total per month"
                className="block h-auto w-full border border-rule-2"
              />
              <figcaption className="label mt-3 text-[0.625rem]">
                Ride history, grouped by month · recorded in a demonstration
                environment, figures illustrative
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ---------- Money ---------- */}
      <section className="border-t border-rule py-20 md:py-28">
        <div className="mx-auto max-w-[86rem] px-6 md:px-10">
          <Reveal className="grid grid-cols-12 gap-y-5 pb-10 md:pb-14">
            <p className="label col-span-12 md:col-span-3">How the money works</p>
            <div className="col-span-12 md:col-span-6 md:col-start-4">
              <h2 className="display display-lg">
                No licence fee, no charge per car.
              </h2>
              <p className="lede mt-6 max-w-[46ch] text-pretty">
                Vellon takes a share of the fares the platform handles. If the
                fleet has a quiet month, so do we.
              </p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
            {TERMS.map((t) => (
              <StaggerItem key={t.index}>
                <div className="border-t border-rule-2 pt-6">
                  <span className="numeral text-sm text-brass">{t.index}</span>
                  <h3 className="display mt-4 text-[1.45rem] leading-tight">
                    {t.title}
                  </h3>
                  <p className="mt-3 max-w-[38ch] text-pretty text-[0.9375rem] leading-relaxed text-fg-2">
                    {t.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- Films ---------- */}
      <section id="films" className="border-t border-rule bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-[86rem] px-6 md:px-10">
          <Reveal className="grid grid-cols-12 gap-y-5 pb-10 md:pb-14">
            <p className="label col-span-12 md:col-span-3">The films</p>
            <div className="col-span-12 md:col-span-6 md:col-start-4">
              <h2 className="display display-lg">Watch it end to end.</h2>
              <p className="lede mt-6 max-w-[46ch] text-pretty">
                Three short films, one per surface, cut from a single scenario.
                Sound on for the narration.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Films />
            <p className="label mt-6 text-[0.625rem]">
              All three recorded in a demonstration environment. Figures
              illustrative.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The two account doors, at the end rather than the top: getting set up
          still goes through us, and a fleet already running Dispatch is
          signing in to an app that lives off this site. */}
      <CTA
        eyebrow="Get started"
        title="See it running on your own map."
        body="Half an hour, your streets, your fares. We'll set the board up with your pickup points before the call."
        actions={[
          { label: "Set up your fleet", href: CONTACT_URL, external: true },
          {
            label: "Sign in to your board",
            href: DASHBOARD_URL,
            external: true,
          },
        ]}
      />
    </>
  );
}
