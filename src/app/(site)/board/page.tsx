import type { Metadata } from "next";
import { ProductPage } from "@/components/site/ProductPage";
import { ScreenFrame } from "@/components/site/Frames";
import { DEMO_CAPTION, PHOTOS, SHOTS } from "@/lib/media";

export const metadata: Metadata = {
  title: "The dispatch board",
  description:
    "A taxi dispatch board with every car and ride on a live map. Auto-assign by real drive time, manual override, phone bookings, scheduled rides and a full ride record.",
  alternates: { canonical: "/board" },
};

export default function BoardPage() {
  return (
    <ProductPage
      path="/board"
      eyebrow="The board"
      title="Dispatch sees everything, and decides anything."
      lede="Every car and every ride on a live map, in the browser. Auto-assign does the routine work; dispatch can reassign, edit or cancel any ride at any point."
      visual={
        <figure>
          <ScreenFrame {...SHOTS.board} priority sizes="(min-width: 1024px) 640px, 100vw" />
          <figcaption className="mt-3 text-xs text-fg-3">{DEMO_CAPTION}</figcaption>
        </figure>
      }
      features={[
        {
          title: "Auto-assign by drive time",
          body: "A new ride goes to the nearest free driver, measured by road. A driver who declines is not asked again for that ride.",
        },
        {
          title: "Override anything",
          body: "Assign a specific driver, reassign mid-shift, move a pickup or cancel. Every action is logged with who did it.",
        },
        {
          title: "Phone bookings",
          body: "Take a booking on the phone and enter it on the board; it is dispatched like any other ride.",
        },
        {
          title: "Scheduled rides, covered",
          body: "Book days or weeks ahead. Each scheduled ride shows whether enough drivers are around to cover it, and is released to a driver shortly before pickup.",
        },
        {
          title: "No double-booking a driver",
          body: "When you assign a ride, the board warns if it would make that driver late for a booking they already accepted.",
        },
        {
          title: "Your fares, your area",
          body: "Set the rates, the service area and vehicle types, including flat fares for places like the airport.",
        },
        {
          title: "The record",
          body: "Revenue by month, ride history, driver reports and passenger reviews, with PDF and CSV export.",
        },
        {
          title: "The fleet at a glance",
          body: "Who is online, who is on a ride and who is free, on the map and in the list.",
        },
        {
          title: "Sign in by email",
          body: "Dispatchers sign in with a code sent to their email. Nothing to install: it runs in the browser.",
        },
      ]}
      photo={PHOTOS.boardHero}
      band={{
        title: "One screen for the whole shift.",
        body: "The board updates live as drivers move, accept and finish rides. Nothing to refresh, nothing to radio in.",
      }}
    />
  );
}
