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
- Contact, privacy and terms stay on vellon.ca (`src/lib/site.ts`): one vendor,
  one contact form, one set of terms.
- Styles are copied from `vellon-webpage` (`globals.css`, `Reveal`, `CTA`, the
  dispatch components). They now evolve separately. `.link-draw` sets `display`
  outside Tailwind's layers, so `hidden` on the same element does nothing: hide a
  wrapper instead.

Local: `npm run dev`, then `http://localhost:3000` for the product site and
`http://go.localhost:3000/keswick` for a link page. Env: `.env.example`
(also set in Vercel).
