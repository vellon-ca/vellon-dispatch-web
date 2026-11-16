import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description:
    "Les conditions d'utilisation de l'application et du tableau de bord Vellon Dispatch.",
  alternates: {
    canonical: "https://vellon.ca/fr/terms",
    languages: { "en-CA": "https://vellon.ca/terms", "fr-CA": "https://vellon.ca/fr/terms" },
  },
};

export default function Page() {
  return <LegalPage doc="terms-of-service" lang="fr" />;
}
