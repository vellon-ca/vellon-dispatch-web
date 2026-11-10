import { APP_STORE_URL, PLAY_LISTED, playUrl } from "@/lib/app";

/* The two ways to get the app. Plain buttons rather than the official badge
   artwork, which carries its own usage rules; swap them in when the listings
   are live. Until a store has the app, its button says so instead of linking
   to a listing that does not exist. */
export function StoreButtons({ slug }: { slug?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <StoreButton label="App Store" href={APP_STORE_URL} />
      <StoreButton label="Google Play" href={PLAY_LISTED ? playUrl(slug) : null} />
    </div>
  );
}

function StoreButton({ label, href }: { label: string; href: string | null }) {
  if (!href) {
    return (
      <div className="flex items-center justify-between border border-rule px-5 py-4 text-sm text-fg-3">
        <span>{label}</span>
        <span className="label text-[0.625rem]">Coming soon</span>
      </div>
    );
  }
  return (
    <a
      href={href}
      className="group flex items-center justify-between border border-rule-2 px-5 py-4 text-sm font-semibold text-fg transition-colors hover:border-fg"
    >
      <span>Get it on {label}</span>
      <span className="transition-transform duration-400 group-hover:translate-x-1">
        &rarr;
      </span>
    </a>
  );
}
