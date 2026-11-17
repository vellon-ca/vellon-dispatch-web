@AGENTS.md

# CLAUDE.md — vellon-dispatch-web

The public website for **Vellon Dispatch**, separate from the company site
(`vellon-webpage`, vellon.ca) so Dispatch-only things can be added without
touching it. Shared project context: `/home/victor/Documents/projects/CLAUDE.md`.

One Next.js 16 project, **two hosts**, split by `src/proxy.ts` (Next 16's name
for middleware):

| Host | Audience | Routes |
|---|---|---|
| `dispatch.vellon.ca` | taxi companies | `src/app/(site)/` — the product page, moved from vellon.ca/dispatch |
| `go.vellon.ca` | passengers | `src/app/go/` — rewritten from the host root |

- **`go.vellon.ca/<slug>`** is a company's link (QR codes, cards, stickers). With
  the app installed the phone opens the app at that company and the page is never
  seen; without it, the page shows the company and the store buttons. Read from
  PROD Supabase with the publishable key via `shared_app_company(slug)`, which
  resolves unlisted companies too. An unresolved slug shows a generic "get the
  app" page, never "company not found".
- **`/.well-known/apple-app-site-association` and `/.well-known/assetlinks.json`**
  are route handlers mapped by the proxy (a dot folder can't be a route). Values in
  `src/lib/app.ts`. **Before the first Play upload, add Play App Signing's SHA-256
  to `ANDROID_SHA256`**, or Play-installed builds open links in the browser.
- **`go.vellon.ca/verify`** ends the student-discount email flow
  (`confirm-student-verification` redirects here). It used to be `verify.html` on
  the dashboard; nothing passenger-facing may point at the dashboard.
- **Slugs live at the root**, so `RESERVED_SLUGS` in `src/lib/app.ts` lists the
  first path segments a company can never use. Keep it in step with the database
  check on `companies.slug`.
- The product site never serves `/go` (proxy returns 404): one copy of every link.
- go.vellon.ca links to vellon.ca for privacy and terms (`src/lib/site.ts`). The
  product site has its own contact, demo and legal pages (below).
- `globals.css` and `Reveal` are shared with go.vellon.ca, whose
  look must not change. `.link-draw` sets `display` outside Tailwind's layers,
  so `hidden` on the same element does nothing: hide a wrapper instead.

## The product site's look (redesign, 2026-11-16)

White, Inter (headings tightly tracked; Inter Tight failed on Vercel), rounded tiles, one cobalt accent (`--accent`) for
what you can act on. Scoped to `.site-root` in `src/app/(site)/site.css`, which
redefines the shared tokens (`--bg`, `--fg`, `--rule`…) so existing utilities
turn light inside it. **Nothing in the redesign may touch the root layout,
`globals.css` or a bare element**: go.vellon.ca shares them.

- Pages: `/`, `/board`, `/passenger-app`, `/driver-app`, `/payments`
  (one template, `components/site/ProductPage.tsx`), `/pricing` (the model
  only, never a rate: Victor), `/switching`, `/faq` (its answers feed the
  FAQPage JSON-LD). Nav, phone menu, footer and sitemap all read `lib/nav.ts`.
- Every screenshot and photo is named in `lib/media.ts`. Phones go in
  `PhoneFrame` (Dynamic Island, drawn in code; send RAW screenshots), the board
  in `ScreenFrame`, photos in `PhotoSlot`, which shows a labelled brief until a
  photo is chosen. Seeded data carries the "Demonstration data" caption.
- SEO: canonical per page (never in a layout, it is inherited), no per-page
  `openGraph` object (it REPLACES the parent's and drops the share image),
  `robots.ts`/`sitemap.ts` at the app root answer only the product host (the
  proxy sends every go.vellon.ca path to /go).
- The demo films (old palette) were taken out 2026-11-16 until new ones are
  made; `components/dispatch/Films.tsx` and `public/media/film-*` are in git
  history (before that commit) if the player is wanted again.
- **Legal pages** (`/privacy`, `/terms`, `/fr/privacy`, `/fr/terms`) render
  `content/legal/*.md` with `lib/legalDoc.ts`, both BYTE-IDENTICAL copies of
  vellon-webpage's (md5 at copy, 2026-11-16: privacy en `c585825d`, terms en
  `db5f25a7`, privacy fr `becdc195`, terms fr `abb54c9a`; recheck with
  `md5sum content/legal/*.md` in both repos). vellon.ca stays canonical until
  the app in review is approved (the app and store listings link there): the
  pages here carry `canonical: https://vellon.ca/...` and are not in the
  sitemap. Until the move, a legal edit goes into BOTH repos, and
  vellon-webpage's `npm run check:legal` is the EN/FR shape check.
- **`/demo` and `/contact`** are server actions in `lib/forms.ts` that email
  hello@vellon.ca through Resend (`RESEND_API_KEY`, set in Vercel for
  Production and Preview). One email per submission and never an auto-reply:
  the Resend account (free, 100/day) also sends dispatcher sign-in codes, and
  an auto-reply would let anyone make no-reply@vellon.ca mail any address.
  Bots are dropped silently by a hidden `website` field and a 3 s minimum
  fill-in time; the backstop is a Vercel Firewall rate limit on both paths.
  The questionnaire is defined once in `lib/demoFields.ts` (form and email).
- Copy states only what the product does today. No stats, testimonials or
  claims about competitors.

Local: `npm run dev`, then `http://localhost:3000` for the product site and
`http://go.localhost:3000/keswick` for a link page. Env: `.env.example`
(also set in Vercel).
