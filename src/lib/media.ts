/* Every screenshot and photo the product site shows, in one place, so
   swapping in new captures is an edit here and a file in public/media.

   Screenshots taken 2026-11-16 on dev (Northstar Taxi, seeded rides):
   phones on an iPhone Pro Max (1320x2868, resized to 900 wide), the board on
   an 11" iPad (2388x1668, the iPad status bar and Safari's address bar
   cropped off, resized to 2000 wide). Send raw captures; frames are drawn in
   code (components/site/Frames.tsx). */

type Board = { src: string; width: number; height: number; alt: string };
type Phone = { src: string; alt: string };

const board = (name: string, height: number, alt: string): Board => ({ src: `/media/${name}.jpg`, width: 2000, height, alt });

export const SHOTS = {
  // The board
  board: board("board", 1343, "The dispatch board: active rides listed on the left, every car on a live map of Halifax"),
  boardRide: board("board-ride", 1343, "The dispatch board with a ride open: driver, pickup, drop-off, fare and the route on the map"),
  newRide: board("new-ride", 1343, "Booking a phone call on the board: passenger, pickup, drop-off, vehicle and driver"),
  revenue: board("revenue", 1236, "Revenue for today, the week, the month and the year, split between cash and card"),
  history: board("history", 1236, "Ride history grouped by month, with PDF and CSV export"),
  scheduled: board("scheduled", 1343, "Scheduled rides on the board, each marked with whether drivers are around to cover it"),

  // Passenger app
  pHome: { src: "/media/p-home.jpg", alt: "Passenger app: the map with nearby cars and where-to" },
  pConfirm: { src: "/media/p-confirm.jpg", alt: "Passenger app: confirming a ride, choosing the vehicle, with the fare shown" },
  pOnTheWay: { src: "/media/p-on-the-way.jpg", alt: "Passenger app: the driver on the way, moving on the map" },
  pSchedule: { src: "/media/p-schedule.jpg", alt: "Passenger app: picking a date and time for a scheduled ride" },
  pRate: { src: "/media/p-rate.jpg", alt: "Passenger app: rating the ride after drop-off" },

  // Driver app
  dOnline: { src: "/media/d-online.jpg", alt: "Driver app: online and waiting for a ride request" },
  dOffer: { src: "/media/d-offer.jpg", alt: "Driver app: a new ride request with a countdown, accept or decline" },
  dNavigate: { src: "/media/d-navigate.jpg", alt: "Driver app: the route to the drop-off" },
  dComplete: { src: "/media/d-complete.jpg", alt: "Driver app: completing a ride and entering the cash fare" },
} satisfies Record<string, Board | Phone>;

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
