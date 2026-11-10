import { APPLE_TEAM_ID, IOS_BUNDLE_ID } from "@/lib/app";

/* Served at go.vellon.ca/.well-known/apple-app-site-association (proxy.ts
   maps it). iOS fetches it through Apple's CDN when the app is installed and
   then opens matching links in the app instead of Safari. Apple caches it for
   days, so a change here reaches devices slowly; never serve it behind a
   redirect, which Apple refuses.

   /verify stays in the browser: it is the end of an email flow and shows a
   result page, not something the app needs to handle. */

export const dynamic = "force-static";

export function GET() {
  return Response.json({
    applinks: {
      details: [
        {
          appIDs: [`${APPLE_TEAM_ID}.${IOS_BUNDLE_ID}`],
          components: [
            { "/": "/verify", exclude: true },
            { "/": "/verify/*", exclude: true },
            { "/": "/.well-known/*", exclude: true },
            { "/": "/*" },
          ],
        },
      ],
    },
  });
}
