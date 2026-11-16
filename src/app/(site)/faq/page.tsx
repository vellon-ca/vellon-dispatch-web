import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { CONTACT_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions taxi companies ask about Vellon Dispatch: phones, phone bookings, card payments, cash, scheduled rides, pricing and switching.",
  alternates: { canonical: "/faq" },
};

/* Plain-text answers: the same strings feed the page and the FAQPage
   structured data, so they can never disagree. */
const FAQ = [
  {
    q: "Do my drivers need new phones?",
    a: "No. The driver app runs on any recent iPhone or Android phone. Each driver signs in on one phone at a time.",
  },
  {
    q: "Do dispatchers need special computers?",
    a: "No. The board runs in a web browser. Dispatchers sign in with a code sent to their email.",
  },
  {
    q: "Can we still take bookings by phone?",
    a: "Yes. Dispatch enters a phone booking on the board and it is dispatched like any other ride. Passengers who prefer to call can keep calling.",
  },
  {
    q: "How do passengers get the app?",
    a: "You share your company's link or QR code. On a phone with the app installed it opens straight to your company; otherwise it shows where to get the app.",
  },
  {
    q: "How does card money reach us?",
    a: "Card fares are charged on your company's own Stripe account and paid out to your bank on Stripe's schedule. Vellon's share is deducted when the fare is charged.",
  },
  {
    q: "Do we have to take cards?",
    a: "No. You can run on cash alone and connect a Stripe account later. Cash fares are recorded when the driver closes out each ride.",
  },
  {
    q: "What does it cost?",
    a: "A share of each fare, the same on cash and card. There is nothing per vehicle or per seat. Card fares have Vellon's share taken at the ride; cash fares are invoiced monthly. Get in touch for your rate.",
  },
  {
    q: "How do scheduled rides work?",
    a: "Passengers or dispatch can book a ride for a set time, days or weeks ahead. The ride is released to a driver shortly before pickup, timed off how far away the nearest drivers are. Drivers can also claim upcoming rides to plan their day.",
  },
  {
    q: "Who chooses the driver for a ride?",
    a: "By default the system offers the ride to the nearest free driver by drive time. Dispatch can assign or reassign any ride at any point.",
  },
  {
    q: "Is it available in French?",
    a: "Yes. The passenger and driver apps are available in English and French and follow the language of the phone.",
  },
  {
    q: "How long does switching take?",
    a: "Setup is your fares, your service area and your drivers. Tell us about your fleet and we will walk you through it.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="mx-auto max-w-[56rem] px-4 pt-14 sm:px-6 md:pt-20">
        <Reveal>
          <p className="text-sm font-semibold text-[var(--accent)]">FAQ</p>
          <h1 className="font-display h-page mt-4">Questions</h1>
          <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-fg-2">
            What taxi companies ask before they switch. Something missing?{" "}
            <a href={CONTACT_URL} className="underline underline-offset-2 hover:text-[var(--accent)]">
              Ask us
            </a>
            .
          </p>
        </Reveal>

        <div className="mt-12 border-t border-rule">
          {FAQ.map((f) => (
            <details key={f.q} className="group border-b border-rule">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="text-2xl font-normal transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="-mt-1 max-w-[62ch] pb-7 leading-relaxed text-fg-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
