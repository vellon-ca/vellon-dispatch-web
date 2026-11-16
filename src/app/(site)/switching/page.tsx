import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { PhotoSlot } from "@/components/site/Frames";
import { PHOTOS } from "@/lib/media";

export const metadata: Metadata = {
  title: "Switching to Vellon Dispatch",
  description:
    "Moving your taxi company from paper and phone, or from another dispatch system, to Vellon Dispatch: what happens, step by step.",
  alternates: { canonical: "/switching" },
};

const STEPS = [
  {
    title: "Tell us about your fleet",
    body: "Your area, your fares, how many cars and drivers, and how your passengers book today.",
  },
  {
    title: "We set up your company",
    body: "Your fares, service area and vehicle types go in, along with any flat fares such as the airport.",
  },
  {
    title: "Dispatchers get the board",
    body: "Each dispatcher signs in with their email. It runs in the browser on the computers you already have.",
  },
  {
    title: "Drivers join with a code",
    body: "Send each driver an invite code from the board. They install the app, enter it and they're on your fleet.",
  },
  {
    title: "Turn on cards when ready",
    body: "Connect your Stripe account from the board's settings. Until then, every ride is cash.",
  },
  {
    title: "Tell your passengers",
    body: "Share your company's link or QR code on cards, stickers and your website. Phone bookings carry on as before.",
  },
];

export default function SwitchingPage() {
  return (
    <>
      <section className="mx-auto grid max-w-[77.5rem] grid-cols-1 items-center gap-12 px-4 pt-14 sm:px-6 md:pt-20 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="text-sm font-semibold text-[var(--accent)]">Switching</p>
          <h1 className="font-display h-page mt-4 max-w-[14ch] text-balance">Retire the book and pencil.</h1>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-fg-2 text-pretty">
            Whether you dispatch from a notebook and the phone today, or from another system, here is what moving
            to Vellon Dispatch looks like.
          </p>
          <Link href="/demo" className="btn btn-accent mt-9">
            Start the conversation
          </Link>
        </Reveal>
        <Reveal delay={0.12}>
          <PhotoSlot {...PHOTOS.ledger} className="aspect-[4/3] rounded-3xl" sizes="(min-width: 1024px) 600px, 100vw" />
        </Reveal>
      </section>

      <section className="mx-auto max-w-[56rem] px-4 pt-24 sm:px-6 md:pt-32">
        <Reveal>
          <h2 className="font-display h-section">Six steps</h2>
        </Reveal>
        <ol className="mt-10">
          {STEPS.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-t border-rule py-7">
              <span className="font-display text-lg font-bold text-[var(--accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 leading-relaxed text-fg-2">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-[56rem] px-4 pt-16 sm:px-6">
        <Reveal>
          <div className="rounded-3xl bg-surface p-8 md:p-10">
            <h2 className="text-xl font-semibold">Coming from another system?</h2>
            <p className="mt-2 max-w-[60ch] leading-relaxed text-fg-2">
              Tell us what you use today and what you would want to keep. Passengers who already have your number
              can keep calling it; dispatch books those rides on the board.
            </p>
            <Link href="/contact" className="link-arrow mt-6 inline-block">
              Talk to us &rarr;
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
