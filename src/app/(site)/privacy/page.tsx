import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Vellon Dispatch handles passenger, driver and dispatch information — what is collected, who it is shared with, where it is stored and how to have it deleted.",
  alternates: {
    canonical: "https://vellon.ca/privacy",
    languages: { "en-CA": "https://vellon.ca/privacy", "fr-CA": "https://vellon.ca/fr/privacy" },
  },
};

export default function Page() {
  return <LegalPage doc="privacy-policy" lang="en" />;
}
