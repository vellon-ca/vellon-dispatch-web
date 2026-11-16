import Image from "next/image";
import type { ReactNode } from "react";

/* Screenshot frames, drawn in code so every screenshot sits in the same
   device and stays sharp at any size. Send raw screenshots, never framed
   ones: the frame is added here. */

/* An iPhone with a Dynamic Island. Proportions are an iPhone 15/16 Pro's
   (393 x 852 pt screen, a 126 x 37 pt island 11 pt from the top), so a raw
   screenshot from any Dynamic Island iPhone lines up with the island. */
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
      <div className="relative aspect-[393/852] overflow-hidden rounded-[12cqw] bg-[#0b0b0c]">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[1.3%] aspect-[126/37] w-[32%] -translate-x-1/2 rounded-full bg-black"
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
  className = "",
  children,
  sizes = "100vw",
}: {
  src?: string;
  alt?: string;
  brief: string;
  className?: string;
  children?: ReactNode;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#1b1e24] ${className}`}>
      {src ? (
        <>
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
          <span aria-hidden="true" className="absolute inset-0 bg-black/35" />
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
