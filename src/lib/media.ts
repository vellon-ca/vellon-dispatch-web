/* Every screenshot and photo the product site shows, in one place, so
   swapping in new captures is an edit here and a file in public/media.

   The screenshots below are the PRE-2026-10 captures (old orange/navy
   palette). Replace each with a new raw capture of the same screen:
   phones from a Dynamic Island iPhone, light mode, no screen recording;
   the board at 1920x1080 or larger. Keep the file name or change it here. */

export const SHOTS = {
  board: { src: "/media/board.jpg", width: 1920, height: 1080, alt: "The dispatch board: active rides listed on the left, every car on a live map" },
  records: { src: "/media/records.jpg", width: 1920, height: 1080, alt: "Ride history grouped by month, with PDF and CSV export" },
  booking: { src: "/media/booking.jpg", alt: "Passenger app: confirming a ride with the fare shown before booking" },
  driverOnline: { src: "/media/offer.jpg", alt: "Driver app: online and waiting for a ride request" },
} as const;

/* Photos still to be chosen (Unsplash). `src` stays undefined until one is
   picked; the slot shows its brief instead. */
export const PHOTOS = {
  nightCity: { src: undefined as string | undefined, brief: "city at night, long-exposure tail lights" },
  aerialRoad: { src: undefined as string | undefined, brief: "aerial road through trees or along the coast" },
  boardHero: { src: undefined as string | undefined, brief: "city grid from above, or a calm desk at night" },
  passengerHero: { src: undefined as string | undefined, brief: "someone waiting at a curb with a phone, or rain on a car window" },
  driverHero: { src: undefined as string | undefined, brief: "hands on a steering wheel at dusk" },
  paymentsHero: { src: undefined as string | undefined, brief: "a card tapping a terminal, close up" },
  ledger: { src: undefined as string | undefined, brief: "an old paper ledger, notebook and pencil" },
};

/* Shown under any screenshot of seeded data. */
export const DEMO_CAPTION = "Demonstration data";
