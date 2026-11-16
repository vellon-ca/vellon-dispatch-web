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

/* Photos from Unsplash (free under the Unsplash License; no credit required),
   chosen by Victor 2026-11-16. The originals are in
   ~/Pictures/Web Redesign Pics/Unsplash/1-8.jpg; portrait ones (1, 2, 5) are
   cropped to a wide band here. `position` is which part a tile keeps. */
type Photo = { src: string | undefined; brief: string; alt: string; position?: string };

export const PHOTOS = {
  nightCity: { src: "/media/photos/night-city.jpg", brief: "city at night", alt: "Light trails along a city street at night, seen from above" },
  aerialRoad: { src: "/media/photos/highway-fence.jpg", brief: "highway along the water", alt: "A waterfront highway and city skyline at dusk, through a chain-link fence", position: "center 60%" },
  boardHero: { src: "/media/photos/aerial-street.jpg", brief: "street grid from above", alt: "A street and rooftops seen straight down from above" },
  passengerHero: { src: "/media/photos/curb-phone.jpg", brief: "waiting at a curb with a phone", alt: "A man at the curb looking at his phone beside a parked car", position: "center 40%" },
  driverHero: { src: "/media/photos/steering-wheel.jpg", brief: "hands on a steering wheel", alt: "A driver's hand on the steering wheel at dusk", position: "center 35%" },
  paymentsHero: { src: "/media/photos/tap-to-pay.jpg", brief: "paying by phone at a terminal", alt: "A phone held to a card terminal to pay", position: "center 70%" },
  ledger: { src: "/media/photos/ledger.jpg", brief: "an old paper ledger", alt: "An old handwritten register open on a table" },
} satisfies Record<string, Photo>;

/* Shown under any screenshot of seeded data. */
export const DEMO_CAPTION = "Demonstration data";
