import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Vellon Dispatch team. We read every message and reply within one business day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-[77.5rem] grid-cols-1 gap-12 px-4 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
      <div>
        <p className="text-sm font-semibold text-[var(--accent)]">Contact</p>
        <h1 className="font-display h-page mt-4 max-w-[12ch]">Talk to us.</h1>
        <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-fg-2">
          A question about Vellon Dispatch, pricing or switching? Send a message and we&rsquo;ll reply within one
          business day.
        </p>
        <dl className="mt-10 flex flex-col gap-6 text-[0.9375rem]">
          <div>
            <dt className="text-fg-3">Email</dt>
            <dd className="mt-1">
              <a href="mailto:hello@vellon.ca" className="font-semibold hover:text-[var(--accent)]">hello@vellon.ca</a>
            </dd>
          </div>
          <div>
            <dt className="text-fg-3">Already a customer?</dt>
            <dd className="mt-1 text-fg-2">
              Use Settings → Support in your dashboard, or{" "}
              <a href="mailto:support@vellon.ca" className="font-semibold text-fg hover:text-[var(--accent)]">support@vellon.ca</a>
            </dd>
          </div>
          <div>
            <dt className="text-fg-3">Want a demo?</dt>
            <dd className="mt-1">
              <Link href="/demo" className="link-arrow">Book one here &rarr;</Link>
            </dd>
          </div>
        </dl>
      </div>
      <ContactForm />
    </section>
  );
}
