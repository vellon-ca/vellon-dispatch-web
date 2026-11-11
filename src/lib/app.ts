/* The passenger app as the link pages and the app-link files see it.
   Everything here is public by design: Apple and Google both fetch the
   association files anonymously, so none of it is a secret. */

/* The shared store app (`ca.vellon.dispatch`, one app, company picked at
   runtime). The per-company builds (cjs, keswick) are not listed: links open
   the shared app only. */
export const APPLE_TEAM_ID = "VGG4PL2ZZY";
export const IOS_BUNDLE_ID = "ca.vellon.dispatch";
export const ANDROID_PACKAGE = "ca.vellon.dispatch";

/* The certificates Android trusts to open go.vellon.ca links. Both stay:
   a Play-installed build is signed by Google's App Signing key, an EAS
   build installed directly (preview, internal) by our upload key. Missing
   either, links on those installs silently open the browser instead of the
   app. */
export const ANDROID_SHA256 = [
  // EAS upload keystore, `ca.vellon.dispatch upload key (2026-09)`
  "58:87:C1:C9:9E:F4:F4:69:84:91:9C:ED:37:DB:4C:E3:A1:C2:73:83:47:EA:A6:80:60:75:95:F8:FE:FE:DD:55",
  // Google Play App Signing key (created at the first Play upload, 2026-11-10)
  "24:5A:DD:32:C5:E6:BD:47:A7:84:1E:67:26:BF:C9:EF:7E:6E:3C:9C:4F:22:EB:61:CD:78:BC:BC:C7:D8:68:69",
];

/* Store listings. null until the app is published; the link pages show
   "coming soon" in place of a badge while a value is null. */
export const APP_STORE_URL: string | null = null;
export const PLAY_STORE_BASE = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;
export const PLAY_LISTED = false;

/* The Play link for one company. Play hands `referrer` to the app on first
   launch (Install Referrer), which is how a fresh Android install opens on the
   company whose link was tapped instead of on the picker. */
export function playUrl(slug?: string): string {
  if (!slug) return PLAY_STORE_BASE;
  return `${PLAY_STORE_BASE}&referrer=${encodeURIComponent(`company=${slug}`)}`;
}

/* First path segments that can never be a company slug, because this site
   serves something else there. The same list must be enforced on
   `companies.slug` in the database, or a company could be created that its
   own link can never reach. */
export const RESERVED_SLUGS = new Set([
  "verify",
  "api",
  "assets",
  "media",
  "static",
  "well-known",
  "app",
  "download",
  "help",
  "support",
  "privacy",
  "terms",
  "go",
  "c",
]);
