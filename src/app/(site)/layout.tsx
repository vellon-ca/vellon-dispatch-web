import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./site.css";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

/* The product site's own font. The root layout (shared with go.vellon.ca)
   keeps Archivo; this loads only on this site's pages. Headings are Inter
   with tightened tracking: Inter Tight failed to build on Vercel ("next/font/
   google queries have exactly one entry", 2026-11-16) while building locally. */
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Vellon Dispatch — taxi dispatch software for modern fleets",
    template: "%s — Vellon Dispatch",
  },
  description:
    "Taxi dispatch software: a live dispatch board, a passenger booking app and a driver app in one system. Card and cash, scheduled or now, for fleets of 3 to 300.",
  openGraph: {
    siteName: "Vellon Dispatch",
    locale: "en_CA",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

/* Who makes the product, for search engines. Points at the Organization that
   vellon.ca describes in full, by its @id. */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://vellon.ca/#organization",
      name: "Vellon",
      legalName: "Vellon Inc.",
      url: "https://vellon.ca",
      sameAs: ["https://www.linkedin.com/company/vellon-inc"],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://dispatch.vellon.ca/#software",
      name: "Vellon Dispatch",
      url: "https://dispatch.vellon.ca",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      description:
        "Taxi dispatch software: a live dispatch board, a passenger booking app and a driver app in one system.",
      publisher: { "@id": "https://vellon.ca/#organization" },
    },
  ],
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`site-root ${inter.variable} flex min-h-full flex-1 flex-col`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <SiteNav />
      <main className="relative flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
