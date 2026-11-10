import Link from "next/link";

/* The closing band. `actions` exists because not every page ends on the same
   ask — a practice-area page ends in a conversation, a product page ends at
   the two doors into the product itself. The first action is the primary and
   gets the rule under it; the rest trail after it as quiet links. */
export type CTAAction = {
  label: string;
  href: string;
  /* Not a routed Link — an <a>. Covers mailto: and tel: as well as http(s),
     which is why the new-tab decision below reads the scheme instead of this
     flag: handing a mail client off to a blank tab leaves an orphan behind. */
  external?: boolean;
};

const DEFAULT_ACTIONS: CTAAction[] = [
  { label: "Start a conversation", href: "/contact" },
  { label: "hello@vellon.ca", href: "mailto:hello@vellon.ca", external: true },
];

const opensTab = (a: CTAAction) => !!a.external && /^https?:/i.test(a.href);

export function CTA({
  eyebrow = "Get in touch",
  title = "Let's build something worth relying on.",
  body = "Tell us what you're working on. We'll be in touch.",
  actions = DEFAULT_ACTIONS,
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  actions?: CTAAction[];
}) {
  const [primary, ...rest] = actions;

  return (
    <section className="relative overflow-hidden border-t border-rule">
      <div className="mx-auto max-w-[86rem] px-6 py-16 md:px-10 md:py-20">
        <div className="border-t-2 border-brass bg-surface">
          <div className="grid grid-cols-12 items-end gap-y-10 px-6 py-14 md:px-12 md:py-16">
            <div className="col-span-12 md:col-span-7">
              <p className="label">{eyebrow}</p>
              <h2 className="display display-lg mt-6 max-w-[18ch] text-balance">
                {title}
              </h2>
            </div>

            <div className="col-span-12 md:col-span-4 md:col-start-9">
              <p className="max-w-[36ch] text-pretty text-[0.9375rem] leading-relaxed text-fg-2">
                {body}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                {primary &&
                  (primary.external ? (
                    <a
                      href={primary.href}
                      {...(opensTab(primary)
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group inline-flex items-center gap-2 border-b border-fg pb-1 text-sm font-semibold text-fg"
                    >
                      {primary.label}
                      <span className="transition-transform duration-400 group-hover:translate-x-1">
                        {opensTab(primary) ? "\u2197" : "\u2192"}
                      </span>
                    </a>
                  ) : (
                    <Link
                      href={primary.href}
                      className="group inline-flex items-center gap-2 border-b border-fg pb-1 text-sm font-semibold text-fg"
                    >
                      {primary.label}
                      <span className="transition-transform duration-400 group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </Link>
                  ))}

                {rest.map((a) =>
                  a.external ? (
                    <a
                      key={a.href}
                      href={a.href}
                      {...(opensTab(a)
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="link-draw text-sm text-fg-2 transition-colors hover:text-fg"
                    >
                      {a.label}
                      {opensTab(a) && (
                        <span aria-hidden className="ml-1 text-fg-3">
                          {"\u2197"}
                        </span>
                      )}
                    </a>
                  ) : (
                    <Link
                      key={a.href}
                      href={a.href}
                      className="link-draw text-sm text-fg-2 transition-colors hover:text-fg"
                    >
                      {a.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
