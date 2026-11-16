import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { PhotoSlot } from "./Frames";
import { ProductIcon } from "./SiteNav";
import { PRODUCT_PAGES } from "@/lib/nav";

export type Feature = { title: string; body: string };

/* One template for the four product pages: a hero with its visual, a grid
   of what it does, a photo band, the other three pages, and the ask. */
export function ProductPage({
  path,
  eyebrow,
  title,
  lede,
  visual,
  features,
  gallery,
  photo,
  band,
}: {
  path: string;
  eyebrow: string;
  title: string;
  lede: string;
  visual: ReactNode;
  features: Feature[];
  /* More screens, shown under the feature list. */
  gallery?: ReactNode;
  photo: { src?: string; brief: string; alt?: string; position?: string };
  band: { title: string; body: string };
}) {
  const others = PRODUCT_PAGES.filter((p) => p.href !== path);

  return (
    <>
      <section className="mx-auto grid max-w-[77.5rem] grid-cols-1 items-center gap-12 px-4 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <Reveal>
          <p className="text-sm font-semibold text-[var(--accent)]">{eyebrow}</p>
          <h1 className="font-display h-page mt-4 max-w-[14ch] text-balance">{title}</h1>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-fg-2 text-pretty">{lede}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/demo" className="btn btn-accent">
              Book a demo
            </Link>
            <Link href="/pricing" className="btn btn-outline">
              How pricing works
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.12}>{visual}</Reveal>
      </section>

      <section className="mx-auto max-w-[77.5rem] px-4 pt-24 sm:px-6 md:pt-32">
        <Reveal>
          <h2 className="font-display h-section max-w-[16ch]">What it does</h2>
        </Reveal>
        <Stagger className="mt-12 grid grid-cols-1 gap-x-10 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <StaggerItem key={f.title} className="border-t border-rule py-7">
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-fg-2">{f.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {gallery ? (
        <section className="mx-auto max-w-[77.5rem] px-4 pt-20 sm:px-6 md:pt-24">
          <Reveal>{gallery}</Reveal>
        </section>
      ) : null}

      <section className="mx-auto max-w-[77.5rem] px-4 pt-24 sm:px-6 md:pt-32">
        <Reveal>
          <PhotoSlot {...photo} className="rounded-3xl">
            <div className="flex min-h-[24rem] flex-col justify-end p-8 text-white md:p-12">
              <h2 className="font-display max-w-[18ch] text-[clamp(1.875rem,3.6vw,2.75rem)] font-bold leading-[1.05]">
                {band.title}
              </h2>
              <p className="mt-3 max-w-[48ch] leading-relaxed text-[#c9ccd2]">{band.body}</p>
            </div>
          </PhotoSlot>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[77.5rem] px-4 pt-24 sm:px-6 md:pt-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display h-section max-w-[16ch]">The rest of the system</h2>
          <Link href="/demo" className="btn btn-dark">
            Book a demo
          </Link>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {others.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex gap-4 rounded-3xl border border-rule p-6 transition-colors hover:border-rule-2 hover:bg-surface"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-rule bg-white">
                <ProductIcon href={p.href} />
              </span>
              <span>
                <span className="block text-lg font-semibold">{p.label}</span>
                <span className="mt-1 block text-[0.9375rem] leading-snug text-fg-2">{p.blurb}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
