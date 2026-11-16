import type { Metadata } from "next";
import { ProductPage } from "@/components/site/ProductPage";
import { PhoneFrame } from "@/components/site/Frames";
import { PHOTOS, SHOTS } from "@/lib/media";

export const metadata: Metadata = {
  title: "Payments",
  description:
    "Card and cash taxi fares in one system. Card fares are charged on your own Stripe account and paid out to your bank; cash is recorded on every ride.",
  alternates: { canonical: "/payments" },
};

export default function PaymentsPage() {
  return (
    <ProductPage
      path="/payments"
      eyebrow="Payments"
      title="Card money lands on its own."
      lede="Card fares are charged on your company's own Stripe account and paid out to your bank. Cash is recorded on every ride. Both appear in the same record."
      visual={
        <div className="flex justify-center">
          <PhoneFrame {...SHOTS.booking} priority className="w-[62%] max-w-[300px]" />
        </div>
      }
      features={[
        {
          title: "Your account, your money",
          body: "Card fares go to your company's Stripe account, then to your bank on Stripe's payout schedule.",
        },
        {
          title: "Set up from the board",
          body: "Connect and manage your Stripe account from the board's settings.",
        },
        {
          title: "Held, then charged",
          body: "The fare is held on the card when the ride is booked and charged when it ends.",
        },
        {
          title: "Scheduled rides, secured",
          body: "A card ride booked ahead is secured a day before pickup. If the card fails, the passenger is asked to fix it in time.",
        },
        {
          title: "Apple Pay",
          body: "Passengers on iPhone can pay with Apple Pay as well as a saved card.",
        },
        {
          title: "Cash, on the record",
          body: "Drivers enter the cash fare when they close out, so cash rides appear in the record too.",
        },
        {
          title: "Refunds",
          body: "Refund a card fare from your Stripe account when you need to.",
        },
        {
          title: "Receipts",
          body: "Passengers get an emailed receipt showing the fare and how it was paid.",
        },
        {
          title: "Cash-only to start",
          body: "You can run on cash alone and switch cards on when you are ready.",
        },
      ]}
      photo={PHOTOS.paymentsHero}
      band={{
        title: "The same rate on cash and card.",
        body: "Vellon's share is the same either way, so no one has a reason to call a card ride cash.",
      }}
    />
  );
}
