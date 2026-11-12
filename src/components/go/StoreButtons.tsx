import {
  APP_STORE_URL,
  PLAY_LISTED,
  PLAY_OPT_IN_URL,
  PLAY_TEST_GROUP_URL,
  PLAY_TESTING,
  playUrl,
} from "@/lib/app";

/* The two ways to get the app. Plain buttons rather than the official badge
   artwork, which carries its own usage rules; swap them in when the listings
   are live. Until a store has the app, its button says so instead of linking
   to a listing that does not exist. */
export function StoreButtons({ slug }: { slug?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <StoreButton label="App Store" href={APP_STORE_URL} />
      {!PLAY_LISTED && PLAY_TESTING ? (
        <PlayTestSteps slug={slug} />
      ) : (
        <StoreButton label="Google Play" href={PLAY_LISTED ? playUrl(slug) : null} />
      )}
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

/* The closed test's way in. Each step is its own page on Google's side, and
   the order matters: Play only offers the opt-in to a member of the group, and
   only lets an opted-in account see the listing. The install link keeps the
   company referrer, so a fresh install still opens on this company. */
function PlayTestSteps({ slug }: { slug?: string }) {
  const steps = [
    { label: "Join the tester group", href: PLAY_TEST_GROUP_URL },
    { label: "Become a tester", href: PLAY_OPT_IN_URL },
    { label: "Install from Google Play", href: playUrl(slug) },
  ];
  return (
    <div className="border border-rule-2 px-5 py-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-fg">Google Play</span>
        <span className="label text-[0.625rem]">Test version</span>
      </div>
      <p className="mt-2 text-[0.8125rem] leading-relaxed text-fg-2">
        The Android app is open to testers before its public release. Use the
        Google account on your phone, and do these in order:
      </p>
      <ol className="mt-4 flex flex-col gap-2">
        {steps.map((step, i) => (
          <li key={step.href}>
            <a
              href={step.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between border border-rule px-4 py-3 text-sm font-semibold text-fg transition-colors hover:border-fg"
            >
              <span>
                <span className="text-fg-3">{i + 1}.</span> {step.label}
              </span>
              <span className="transition-transform duration-400 group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
