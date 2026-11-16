import Image from "next/image";
import type { ReactNode } from "react";

/* Screenshot frames, drawn in code so every screenshot sits in the same
   device and stays sharp at any size. Send raw screenshots, never framed
   ones: the frame is added here. */

/* An iPhone with a Dynamic Island, in Pro Max proportions (440 x 956 pt
   screen, a 126 x 37 pt island 11 pt from the top): the screenshots are
   1320 x 2868 Pro Max captures, and the island lands where theirs was. */
export function PhoneFrame({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 280px, 45vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  /* Sized in container units of the phone itself: a % padding would be
     measured against the PARENT's width and thicken the bezel on wide
     layouts. */
  return (
    <div className={`[container-type:inline-size] ${className}`}>
      <div className="rounded-[15cqw] bg-[#0b0b0c] p-[3.2cqw] shadow-[0_30px_60px_-20px_rgba(11,11,12,0.45)]">
      <div className="relative aspect-[440/956] overflow-hidden rounded-[12cqw] bg-[#0b0b0c]">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[1.15%] aspect-[126/37] w-[28.6%] -translate-x-1/2 rounded-full bg-black"
        />
      </div>
      </div>
    </div>
  );
}

/* A dashboard screenshot: rounded, hairline, soft shadow. No fake browser
   chrome. */
export function ScreenFrame({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  sizes = "(min-width: 1240px) 1120px, 100vw",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[18px] border border-rule-2 shadow-[0_40px_80px_-30px_rgba(11,11,12,0.35)] ${className}`}
    >
      <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} className="block h-auto w-full" />
    </div>
  );
}

/* A photograph, or until one is chosen, a labelled dark slot describing the
   photo it is waiting for. `children` are laid over it (headline, button). */
export function PhotoSlot({
  src,
  alt = "",
  brief,
  position = "center",
  scrim = "bottom",
  className = "",
  children,
  sizes = "100vw",
}: {
  src?: string;
  alt?: string;
  brief: string;
  /* object-position: which part of the photo a crop keeps. */
  position?: string;
  /* "bottom" darkens under bottom-left text; "even" under centred text. */
  scrim?: "bottom" | "even";
  className?: string;
  children?: ReactNode;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#1b1e24] ${className}`}>
      {src ? (
        <>
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: position }} />
          {/* A fade only where text sits on the photo. */}
          {children ? <span
            aria-hidden="true"
            className={`absolute inset-0 ${
              scrim === "even" ? "bg-black/50" : "bg-gradient-to-t from-black/80 via-black/35 to-black/5"
            }`}
          /> : null}
        </>
      ) : (
        <p className="absolute right-4 top-3.5 m-0 flex items-center gap-1.5 text-xs text-[#9ea3ad]">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          Photo: {brief}
        </p>
      )}
      {children ? <div className="relative h-full">{children}</div> : null}
    </div>
  );
}

/* A row of phones with a caption under each (product pages). */
export function PhoneRow({ shots }: { shots: { src: string; alt: string; caption: string }[] }) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-5 gap-y-10 md:gap-x-8 ${
        shots.length > 3 ? "md:grid-cols-4" : shots.length === 3 ? "mx-auto max-w-[54rem] md:grid-cols-3" : "mx-auto max-w-[36rem]"
      }`}
    >
      {shots.map((s) => (
        <figure key={s.src} className="flex flex-col items-center">
          <PhoneFrame src={s.src} alt={s.alt} className="w-full max-w-[250px]" sizes="(min-width: 768px) 250px, 45vw" />
          <figcaption className="mt-4 text-center text-[0.9375rem] font-medium">{s.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/* Board screens side by side, with a caption under each (product pages). */
export function ScreenGrid({
  shots,
}: {
  shots: { src: string; alt: string; width: number; height: number; caption: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2">
      {shots.map((s) => (
        <figure key={s.src}>
          <ScreenFrame src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(min-width: 768px) 600px, 100vw" />
          <figcaption className="mt-4 text-[0.9375rem] font-medium">{s.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
