"use client";

import { useEffect, useRef, useState } from "react";

/* Two phones running as one sequence: the booking finishes, and the offer
   lands on a driver's phone a beat later. The point of the pairing is that
   the beat is short — the dispatch is quick, and the page should feel it.

   `ended` is what drives the handoff, and it never fires on a looping video,
   so neither clip carries `loop` and the cycle is run here. After the offer
   has sat on screen long enough to read the countdown, HOLD_MS lets it rest
   before the sequence starts over. */

const HOLD_MS = 1600;

const STEPS = [
  {
    src: "/media/booking.mp4",
    poster: "/media/booking.jpg",
    step: "Step 01",
    title: "The booking is placed",
    body: "The fare is quoted before the ride is confirmed. Once it's booked, the passenger waits on a driver.",
  },
  {
    src: "/media/offer.mp4",
    poster: "/media/offer.jpg",
    step: "Step 02",
    title: "The nearest car is offered it",
    body: "Distance, fare and pickup on one card, with a countdown before it moves to the next driver.",
  },
];

export function SurfacePair() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const clipRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const clips = clipRefs.current;
    if (!wrap || clips.length !== 2 || !clips[0] || !clips[1]) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) return;

    const go = (i: number) => {
      stepRef.current = i;
      setStep(i);
      const v = clips[i];
      if (!v) return;
      try {
        v.currentTime = 0;
      } catch {}
      v.play()?.catch(() => {});
    };

    const onEnded = (i: number) => () => {
      if (stepRef.current !== i) return;
      if (i === 0) {
        go(1);
        return;
      }
      // Let the countdown sit for a moment before the loop comes round again.
      timerRef.current = setTimeout(() => {
        const other = clips[1];
        if (other) {
          try {
            other.currentTime = 0;
          } catch {}
        }
        go(0);
      }, HOLD_MS);
    };

    const handlers = clips.map((v, i) => {
      const h = onEnded(i);
      v?.addEventListener("ended", h);
      return h;
    });

    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            go(0);
            io.disconnect();
          }
        });
      },
      { rootMargin: "-80px" }
    );
    io.observe(wrap);

    return () => {
      io.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
      clips.forEach((v, i) => v?.removeEventListener("ended", handlers[i]));
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="mx-auto mt-12 grid max-w-[52rem] grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 sm:gap-12"
    >
      {STEPS.map((s, i) => {
        const live = step === i;
        return (
          <figure
            key={s.src}
            className="w-full max-w-[22rem] transition-opacity duration-500"
            style={{ opacity: live ? 1 : 0.42 }}
          >
            <video
              ref={(el) => {
                clipRefs.current[i] = el;
              }}
              src={s.src}
              poster={s.poster}
              muted
              playsInline
              preload="auto"
              className="block h-auto w-full border transition-colors duration-500"
              style={{ borderColor: live ? "var(--brass-dim)" : "var(--rule-2)" }}
            />
            <figcaption className="mt-4">
              <span
                className="label inline-flex items-center gap-2 transition-colors duration-400"
                style={{ color: live ? "var(--brass)" : "var(--fg-3)" }}
              >
                <i
                  aria-hidden
                  className="block h-[5px] w-[5px] transition-colors duration-400"
                  style={{ background: live ? "var(--brass)" : "var(--fg-3)" }}
                />
                {s.step}
              </span>
              <b className="mt-1.5 block text-[0.9375rem] font-semibold text-fg">
                {s.title}
              </b>
              <p className="mt-1.5 text-[0.875rem] text-fg-2">{s.body}</p>
              <p className="label mt-3 text-[0.625rem]">
                Demonstration environment
              </p>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
