import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { PhoneFrame, PhotoSlot, ScreenFrame } from "@/components/site/Frames";
import { CONTACT_URL } from "@/lib/site";
import { DEMO_CAPTION, PHOTOS, SHOTS } from "@/lib/media";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const FACTS = [
  { term: "Built for", detail: "Taxi fleets, 3 cars to 300" },
  { term: "One system", detail: "Board, passenger app, driver app" },
  { term: "What it costs", detail: "A share of fares, the same on cash and card" },
];

const APPS = [
  {
    href: "/board",
    who: "For dispatch",
    name: "The board",
    body: "Every car and every ride on one screen, with override at any point in the ride.",
  },
  {
    href: "/passenger-app",
    who: "For riders",
    name: "The passenger app",
    body: "Book now or later, pay by card or cash, and watch the car arrive live.",
  },
  {
    href: "/driver-app",
    who: "For drivers",
    name: "The driver app",
    body: "Offers with a countdown, directions to the pickup, and a two-tap close-out.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-[77.5rem] px-4 pt-16 text-center sm:px-6 md:pt-24">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-rule-2 px-3.5 py-1.5 text-[0.8125rem] text-fg-2">
            <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-[#1f9d55]" />
            Dispatch, passenger and driver apps in one system
          </p>
          <h1 className="font-display h-hero mx-auto mt-7 max-w-[14ch] text-balance">
            Run the whole fleet from one screen.
          </h1>
          <p className="mx-auto mt-6 max-w-[46ch] text-lg leading-relaxed text-fg-2 text-pretty md:text-[1.1875rem]">
            The board, the cars, the fares, and a record of every ride that outlives the shift.
            Taxi dispatch software for fleets of 3 cars to 300.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={CONTACT_URL} className="btn btn-accent">
              Book a demo
            </a>
            <Link href="/board" className="btn btn-outline">
              Explore the product
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative mx-auto mt-16 max-w-[70rem] pb-6 md:mt-20 md:pb-10">
          <ScreenFrame {...SHOTS.boardRide} priority />
          <PhoneFrame
            {...SHOTS.pOnTheWay}
            priority
            className="absolute -bottom-2 -left-2 w-[24%] min-w-[96px] md:-left-6 md:w-[22%]"
          />
          <PhoneFrame
            {...SHOTS.dOffer}
            priority
            className="absolute -bottom-2 -right-2 w-[24%] min-w-[96px] md:-right-6 md:w-[22%]"
          />
        </Reveal>
        <p className="mt-6 text-xs text-fg-3">{DEMO_CAPTION}</p>
      </section>

      {/* ---------- Facts ---------- */}
      <section className="mx-auto mt-12 max-w-[77.5rem] px-4 sm:px-6">
        <dl className="grid grid-cols-1 border-y border-rule md:grid-cols-3">
          {FACTS.map((f) => (
            <div key={f.term} className="px-2 py-6 md:py-7">
              <dt className="text-[0.8125rem] text-fg-3">{f.term}</dt>
              <dd className="mt-1.5 text-lg font-semibold">{f.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- Bento ---------- */}
      <section className="mx-auto max-w-[77.5rem] px-4 pt-24 sm:px-6 md:pt-32">
        <Reveal>
          <h2 className="font-display h-section max-w-[18ch] text-balance">
            Everything a dispatcher does, in one place.
          </h2>
        </Reveal>

        <Stagger className="mt-12 grid auto-rows-[minmax(18.75rem,auto)] grid-cols-1 gap-4 md:grid-cols-3">
          <StaggerItem className="flex flex-col overflow-hidden rounded-3xl bg-surface md:col-span-2">
            <div className="px-7 pt-7 md:px-8 md:pt-8">
              <h3 className="text-[1.375rem] font-semibold tracking-[-0.01em]">Auto-assign by real drive time</h3>
              <p className="mt-2 max-w-[48ch] leading-relaxed text-fg-2">
                The nearest free driver gets the ride, measured by road, not as the crow flies.
                Dispatch can override at any point.
              </p>
            </div>
            <div className="relative ml-7 mt-7 min-h-[13.75rem] flex-1 overflow-hidden rounded-tl-[14px] border-l border-t border-rule-2 md:ml-8">
              <Image src={SHOTS.tileAssign.src} alt="" fill unoptimized className="object-cover object-left-top" />
            </div>
          </StaggerItem>

          <StaggerItem className="flex flex-col justify-between rounded-3xl bg-[var(--ink)] p-7 text-white md:p-8">
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
            <div className="mt-10">
              <h3 className="text-[1.375rem] font-semibold">Same rate on cash and card</h3>
              <p className="mt-2 leading-relaxed text-[var(--ink-2)]">No one has a reason to call a card ride cash.</p>
            </div>
          </StaggerItem>

          <StaggerItem className="flex overflow-hidden rounded-3xl bg-surface pl-7 pt-7 md:pl-8 md:pt-8">
            <div className="flex-1 pr-4">
              <h3 className="text-[1.375rem] font-semibold">Fare known up front</h3>
              <p className="mt-2 leading-relaxed text-fg-2">
                Passengers see the price, the driver, the car and the plate before pickup.
              </p>
            </div>
            <div className="relative h-[15.5rem] w-[44%] self-end overflow-hidden rounded-t-[22px] border-[6px] border-b-0 border-[var(--ink)] bg-[var(--ink)]">
              <Image src={SHOTS.pConfirm.src} alt="" fill unoptimized className="object-cover object-top" />
            </div>
          </StaggerItem>

          <StaggerItem className="overflow-hidden rounded-3xl md:col-span-2">
            <PhotoSlot {...PHOTOS.nightCity} className="h-full min-h-[20rem]" sizes="(min-width: 768px) 800px, 100vw">
              <div className="flex h-full min-h-[20rem] flex-col justify-end p-8 text-white md:p-9">
                <h3 className="font-display max-w-[16ch] text-[2rem] font-bold leading-tight md:text-[2.125rem]">
                  Built for fleets that never close.
                </h3>
                <p className="mt-2.5 max-w-[46ch] leading-relaxed text-[#c9ccd2]">
                  Rides booked weeks ahead are released to the right driver at the right moment, day or night.
                </p>
              </div>
            </PhotoSlot>
          </StaggerItem>

          <StaggerItem className="flex flex-col overflow-hidden rounded-3xl bg-surface md:col-span-2">
            <div className="px-7 pt-7 md:px-8 md:pt-8">
              <h3 className="text-[1.375rem] font-semibold">The book they&rsquo;ve never had</h3>
              <p className="mt-2 max-w-[52ch] leading-relaxed text-fg-2">
                Every ride, fare and driver, kept and searchable. Export a month to PDF or CSV in one click.
              </p>
            </div>
            <div className="relative mx-7 mt-7 min-h-[13.75rem] flex-1 overflow-hidden rounded-t-[14px] border-x border-t border-rule-2 md:mx-8">
              <Image src={SHOTS.tileHistory.src} alt="" fill unoptimized className="object-cover object-left-top" />
            </div>
          </StaggerItem>

          <StaggerItem className="flex flex-col justify-between rounded-3xl bg-[var(--accent)] p-7 text-white md:p-8">
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 2v20M2 12h20" />
            </svg>
            <div className="mt-10">
              <h3 className="text-[1.375rem] font-semibold">Nothing per vehicle</h3>
              <p className="mt-2 leading-relaxed text-[#dce4ff]">
                Add a car in summer, take it off in winter. The cost moves with the work.
              </p>
            </div>
          </StaggerItem>
        </Stagger>
      </section>

      {/* ---------- Three apps ---------- */}
      <section className="mx-auto max-w-[77.5rem] px-4 pt-28 sm:px-6 md:pt-36">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display h-section max-w-[14ch]">Three apps. One system.</h2>
          <Link href="/board" className="link-arrow">
            Explore the product &rarr;
          </Link>
        </Reveal>
        <Stagger className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {APPS.map((a) => (
            <StaggerItem key={a.href}>
              <Link
                href={a.href}
                className="group block h-full rounded-3xl border border-rule p-7 transition-colors hover:border-rule-2 hover:bg-surface"
              >
                <p className="text-[0.8125rem] text-fg-3">{a.who}</p>
                <h3 className="mt-1.5 text-2xl font-semibold">{a.name}</h3>
                <p className="mt-2.5 leading-relaxed text-fg-2">{a.body}</p>
                <span className="mt-6 inline-block font-semibold transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ---------- Closing band ---------- */}
      <section className="mx-auto max-w-[77.5rem] px-4 pt-28 sm:px-6 md:pt-36">
        <Reveal>
          <PhotoSlot {...PHOTOS.aerialRoad} scrim="even" className="rounded-[2rem]">
            <div className="flex min-h-[27.5rem] flex-col items-center justify-center px-6 py-12 text-center text-white">
              <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] font-bold leading-none">See it run your fleet.</h2>
              <p className="mx-auto mt-4 max-w-[40ch] text-[1.0625rem] text-[#c9ccd2]">
                Tell us about your fleet and we will show you the board on your own streets.
              </p>
              <a href={CONTACT_URL} className="btn btn-light mt-8">
                Book a demo
              </a>
            </div>
          </PhotoSlot>
        </Reveal>
      </section>
    </>
  );
}
