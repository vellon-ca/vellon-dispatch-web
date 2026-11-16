import type { Metadata } from "next";
import { ProductPage } from "@/components/site/ProductPage";
import { PhoneFrame } from "@/components/site/Frames";
import { DEMO_CAPTION, PHOTOS, SHOTS } from "@/lib/media";

export const metadata: Metadata = {
  title: "Passenger app",
  description:
    "A taxi booking app for your passengers: the fare before booking, card or cash, rides now or scheduled, and the car moving live on the map.",
  alternates: { canonical: "/passenger-app" },
};

export default function PassengerAppPage() {
  return (
    <ProductPage
      path="/passenger-app"
      eyebrow="The passenger app"
      title="Booking a taxi, the way people expect it now."
      lede="Your passengers book with your company, see the fare before they confirm, and watch the car arrive. iPhone and Android."
      visual={
        <figure className="flex flex-col items-center">
          <PhoneFrame {...SHOTS.booking} priority className="w-[62%] max-w-[300px]" />
          <figcaption className="mt-4 text-xs text-fg-3">{DEMO_CAPTION}</figcaption>
        </figure>
      }
      features={[
        {
          title: "The fare before booking",
          body: "Passengers see the price for the trip before they confirm it.",
        },
        {
          title: "Now or later",
          body: "Book a ride now, or schedule one for a set time days or weeks ahead.",
        },
        {
          title: "Card or cash",
          body: "Pay by saved card or Apple Pay, or pay the driver in cash.",
        },
        {
          title: "The car, live",
          body: "The driver's name, car and plate on screen before pickup, and the car moving on the map.",
        },
        {
          title: "Talk to the driver",
          body: "Message the driver from the app during the ride.",
        },
        {
          title: "Receipts and ratings",
          body: "An emailed receipt after every ride, and a rating that dispatch can read.",
        },
        {
          title: "Your company's link",
          body: "Share a link or QR code. It opens the app at your company, or shows where to get it.",
        },
        {
          title: "English and French",
          body: "The app follows the language of the passenger's phone.",
        },
        {
          title: "The vehicle they need",
          body: "Passengers can choose a vehicle type you offer, such as a larger or wheelchair-accessible car.",
        },
      ]}
      photo={PHOTOS.passengerHero}
      band={{
        title: "No more “where's my cab?” calls.",
        body: "When passengers can see the car coming, they stop phoning to ask. Dispatch gets the line back.",
      }}
    />
  );
}
