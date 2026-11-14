import type { Metadata } from "next";
import "./corporate.css";

/* The business account manager portal. A working tool, not a marketing page:
   it follows the dispatch dashboard's look (neutral greys, one cobalt action
   colour, light or dark with the browser), not the product site's. */

export const metadata: Metadata = {
  metadataBase: new URL("https://corporate.vellon.ca"),
  title: "Business accounts",
  robots: { index: false, follow: false },
};

export default function CorporateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="cp">{children}</div>;
}
