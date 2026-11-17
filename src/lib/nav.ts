/* The product site's pages, in one list: the nav, the phone menu, the
   footer and the sitemap all read from here, so a new page is added once. */

export type NavPage = {
  href: string;
  label: string;
  /* One line for the Product menu. */
  blurb?: string;
};

export const PRODUCT_PAGES: NavPage[] = [
  { href: "/board", label: "The board", blurb: "Every car and every ride on one screen" },
  { href: "/passenger-app", label: "Passenger app", blurb: "Book with the fare known up front" },
  { href: "/driver-app", label: "Driver app", blurb: "Offers, directions, a two-tap close-out" },
  { href: "/payments", label: "Payments", blurb: "Card and cash, settled to your account" },
];

export const TOP_PAGES: NavPage[] = [
  { href: "/pricing", label: "Pricing" },
  { href: "/switching", label: "Switching" },
  { href: "/faq", label: "FAQ" },
];

export const SITE_URL = "https://dispatch.vellon.ca";
