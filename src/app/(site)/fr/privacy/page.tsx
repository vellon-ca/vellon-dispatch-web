import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Vellon Dispatch traite les renseignements des passagers, des chauffeurs et du personnel de la centrale : ce qui est recueilli, à qui c'est communiqué, où c'est conservé et comment le faire supprimer.",
  alternates: {
    canonical: "https://vellon.ca/fr/privacy",
    languages: { "en-CA": "https://vellon.ca/privacy", "fr-CA": "https://vellon.ca/fr/privacy" },
  },
};

export default function Page() {
  return <LegalPage doc="privacy-policy" lang="fr" />;
}
