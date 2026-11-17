import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for using the Vellon Dispatch app and dashboard — what Vellon is responsible for, what the taxi company is responsible for, and how fares, accounts and payments work.",
  alternates: {
    canonical: "https://vellon.ca/terms",
    languages: { "en-CA": "https://vellon.ca/terms", "fr-CA": "https://vellon.ca/fr/terms" },
  },
};

export default function Page() {
  return <LegalPage doc="terms-of-service" lang="en" />;
}
