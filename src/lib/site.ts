/* Where this site sends people that it does not serve itself. The company
   pages (contact, legal) stay on vellon.ca: Vellon is the vendor, Dispatch is
   one of its products, and there is one contact form and one set of terms. */
export const VELLON_URL = "https://vellon.ca";
export const CONTACT_URL = `${VELLON_URL}/contact`;
export const PRIVACY_URL = `${VELLON_URL}/privacy`;
export const TERMS_URL = `${VELLON_URL}/terms`;

/* The dispatch board. Staff only: nothing a passenger opens may point here. */
export const DASHBOARD_URL = "https://dashboard.vellon.ca";

/* The two hosts this one project serves. `proxy.ts` sends GO_HOST requests to
   the /go routes; every other host gets the product site. */
export const SITE_HOST = "dispatch.vellon.ca";
export const GO_HOST = "go.vellon.ca";
