import type { MetadataRoute } from "next";
import { PRODUCT_PAGES, SITE_URL, TOP_PAGES } from "@/lib/nav";

/* The product site's pages. Contact, privacy and terms live on vellon.ca and
   are in its sitemap. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    ...PRODUCT_PAGES.map((p) => ({
      url: `${SITE_URL}${p.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...TOP_PAGES.map((p) => ({
      url: `${SITE_URL}${p.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/demo`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.6 },
    /* /privacy and /terms are left out until they move here from vellon.ca
       (after the app review); until then their canonical is vellon.ca. */
    { url: `${SITE_URL}/delete-account`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
