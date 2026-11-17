import type { Metadata } from "next";
import { ProductPage } from "@/components/site/ProductPage";
import { PhoneFrame, PhoneRow } from "@/components/site/Frames";
import { DEMO_CAPTION, PHOTOS, SHOTS } from "@/lib/media";

export const metadata: Metadata = {
  title: "Driver app",
  description:
    "A taxi driver app: ride offers with a countdown, directions to the pickup, scheduled rides to plan the day, and a close-out that captures the card or records the cash.",
  alternates: { canonical: "/driver-app" },
};

export default function DriverAppPage() {
  return (
    <ProductPage
      path="/driver-app"
      eyebrow="The driver app"
      title="Everything the driver needs, nothing they don't."
      lede="Go online, take the offer, drive, close out. Built to be used one-handed between rides, on iPhone and Android."
      visual={
        <figure className="flex flex-col items-center">
          <PhoneFrame {...SHOTS.dOffer} priority className="w-[62%] max-w-[300px]" />
          <figcaption className="mt-4 text-xs text-fg-3">{DEMO_CAPTION}</figcaption>
        </figure>
      }
      features={[
        {
          title: "Offers with a countdown",
          body: "A ride offer shows the pickup and drop-off with a timer. Accept or decline in one tap.",
        },
        {
          title: "Directions to the door",
          body: "One tap opens the route to the pickup, then to the drop-off, in the driver's maps app.",
        },
        {
          title: "Close out in two taps",
          body: "Card rides are charged automatically at the end. Cash rides take the amount and that's it.",
        },
        {
          title: "Plan the day",
          body: "Drivers can see upcoming scheduled rides and claim the ones they want to take.",
        },
        {
          title: "Time to leave",
          body: "A reminder when it's time to head to a scheduled pickup.",
        },
        {
          title: "Their own rating",
          body: "Drivers see their average rating. Passenger comments go to dispatch.",
        },
        {
          title: "One phone per driver",
          body: "A driver account is signed in on one device at a time.",
        },
        {
          title: "Shifts that end themselves",
          body: "A driver who forgets to go offline is asked, then taken offline, so no ride is offered to an empty car.",
        },
        {
          title: "Invite-only",
          body: "Drivers join your company with an invite code from the board.",
        },
      ]}
      gallery={
        <PhoneRow
          shots={[
            { ...SHOTS.dOnline, caption: "Online, waiting for a ride" },
            { ...SHOTS.dNavigate, caption: "The route to the drop-off" },
            { ...SHOTS.dComplete, caption: "Close out a cash ride" },
          ]}
        />
      }
      photo={PHOTOS.driverHero}
      band={{
        title: "Fewer calls on the radio.",
        body: "The offer, the address and the passenger's details are already on the driver's phone.",
      }}
    />
  );
}
