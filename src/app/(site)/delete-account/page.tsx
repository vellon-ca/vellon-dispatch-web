import type { Metadata } from "next";
import { PRIVACY_URL } from "@/lib/site";

/* Google Play's account-deletion URL for the Vellon app (ca.vellon.dispatch).
   Play wants a page, reachable without installing the app, that names the app
   and developer, gives the steps, and says what is deleted and what is kept.
   Requests by email are handled by hand for now (Victor, 2026-11-10).

   Every "kept" line restates vellon.ca/privacy ("How long we keep things",
   "Closing your account"). Change them together, or the two disagree. */

export const metadata: Metadata = {
  title: "Delete your Vellon account",
  description:
    "How to delete your account in the Vellon taxi booking app, and what is deleted and kept.",
  alternates: { canonical: "https://dispatch.vellon.ca/delete-account" },
};

const SUPPORT = "support@vellon.ca";
const MAILTO = `mailto:${SUPPORT}?subject=${encodeURIComponent("Delete my Vellon account")}`;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-rule pt-8">
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      <div className="mt-4 space-y-4 text-[0.9375rem] leading-relaxed text-fg-2">{children}</div>
    </section>
  );
}

export default function DeleteAccountPage() {
  return (
    <div className="pt-32 pb-24 md:pt-40">
      <div className="mx-auto max-w-[44rem] px-6 md:px-10">
        <p className="label">Vellon · Account</p>
        <h1 className="display mt-6 text-[clamp(2rem,5vw,3rem)] leading-tight">
          Delete your Vellon account
        </h1>
        <p className="lede mt-6 text-pretty">
          This page is for the <strong className="text-fg">Vellon</strong> taxi
          booking app by Vellon, used by passengers and drivers of taxi
          companies that run on Vellon Dispatch. Your account with each taxi
          company is separate, so deleting one leaves any others untouched.
        </p>

        <div className="mt-12 space-y-12">
          <Section title="In the app (fastest)">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <span className="text-fg">Passengers:</span> tap your profile
                picture, then <span className="text-fg">Profile</span>, then{" "}
                <span className="text-fg">Delete account</span>.
              </li>
              <li>
                <span className="text-fg">Drivers:</span> tap your profile
                picture, then <span className="text-fg">Edit profile</span>, then{" "}
                <span className="text-fg">Delete account</span>.
              </li>
            </ol>
            <p>
              It takes effect immediately. A passenger with a ride in progress is
              asked to finish or cancel it first; a driver carrying a passenger
              has the request completed as soon as that trip ends.
            </p>
          </Section>

          <Section title="Without the app">
            <p>
              Email{" "}
              <a href={MAILTO} className="link-draw text-fg">
                {SUPPORT}
              </a>{" "}
              with the subject &ldquo;Delete my Vellon account&rdquo;. Include:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>the phone number or email address you sign in with,</li>
              <li>the taxi company the account is with, or &ldquo;all&rdquo;.</li>
            </ul>
            <p>
              We will send a code to that phone number or email address to
              confirm the account is yours, then delete it and reply to tell you
              it is done, within 30 days.
            </p>
          </Section>

          <Section title="What is deleted">
            <ul className="list-disc space-y-2 pl-5">
              <li>Your profile: name, phone number, email address and photo.</li>
              <li>Saved places and saved payment cards, including the customer record held by our payment processor, Stripe.</li>
              <li>Your sign-in, and your device&rsquo;s notification token.</li>
            </ul>
          </Section>

          <Section title="What is kept, and for how long">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="text-fg">Trip records, receipts and fares</span>{" "}
                are kept for at least 6 years, because they are the taxi
                company&rsquo;s financial records and Canadian tax law requires
                it. A passenger&rsquo;s trips and reviews are detached from them
                so they no longer name you.
              </li>
              <li>
                <span className="text-fg">Drivers</span> are anonymised rather
                than erased: name, contact details, photo, vehicle and device are
                removed, but completed trips stay attached to the driver record.
                Shift location history is kept for 12 months as the
                company&rsquo;s fleet record, then deleted.
              </li>
              <li>
                <span className="text-fg">Safety reports</span> about a driver
                are kept, with names as they were when filed.
              </li>
            </ul>
            <p>Deletion cannot be undone. You can sign up again later with the same number.</p>
          </Section>

          <p className="border-t border-rule pt-8 text-sm text-fg-3">
            Full detail is in our{" "}
            <a href={PRIVACY_URL} className="link-draw text-fg-2 hover:text-fg">
              privacy policy
            </a>
            . Questions:{" "}
            <a href={`mailto:${SUPPORT}`} className="link-draw text-fg-2 hover:text-fg">
              {SUPPORT}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
