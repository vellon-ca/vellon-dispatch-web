import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* One project, two hosts. go.vellon.ca is the passenger link domain and is
   rewritten onto the /go routes; every other host is the product site, which
   must never serve /go itself (a passenger page on the company site would be a
   second, unassociated copy of every link).

   `go.localhost` stands in for go.vellon.ca in `next dev`. */
const GO_HOSTS = new Set(["go.vellon.ca", "go.localhost"]);

/* The association files have fixed names that cannot be route folders here
   (a leading dot), so each is mapped to a plain route explicitly. */
const WELL_KNOWN: Record<string, string> = {
  "/.well-known/apple-app-site-association": "/go/well-known/apple-app-site-association",
  "/.well-known/assetlinks.json": "/go/well-known/assetlinks",
};

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;

  if (GO_HOSTS.has(host)) {
    const target = WELL_KNOWN[pathname] ?? `/go${pathname === "/" ? "" : pathname}`;
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.rewrite(url);
  }

  if (pathname === "/go" || pathname.startsWith("/go/")) {
    return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /* Everything except build output and the product site's static media. */
    "/((?!_next/static|_next/image|media/|favicon.ico|icon.svg).*)",
  ],
};
