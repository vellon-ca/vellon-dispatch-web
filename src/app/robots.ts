import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/nav";

/* Served for the product site only: on go.vellon.ca the proxy rewrites every
   path onto the /go routes, so this never answers there, and the link pages
   keep their own noindex. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
