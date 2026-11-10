import { ANDROID_PACKAGE, ANDROID_SHA256 } from "@/lib/app";

/* Served at go.vellon.ca/.well-known/assetlinks.json (proxy.ts maps it).
   Android checks it at install time to decide whether the app may open
   go.vellon.ca links directly. Unlike iOS it has no per-path exclusions here:
   which paths open the app is decided by the app's own intent filter, so the
   app must treat /verify as "show the result" rather than as a company slug. */

export const dynamic = "force-static";

export function GET() {
  return Response.json([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: ANDROID_PACKAGE,
        sha256_cert_fingerprints: ANDROID_SHA256,
      },
    },
  ]);
}
