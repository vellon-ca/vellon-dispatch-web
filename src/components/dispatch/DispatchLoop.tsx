"use client";

import { useEffect, useRef, useState } from "react";

/* FIG. 02 — the dispatch loop.

   Where FIG. 01 is a static stack, this is a cycle: a request arrives, the
   board places it, a car takes it, the ride runs, the fare settles, and the
   record lands back on the board. That closing arc is the part a paper book
   has never had, so it is the only brass in the drawing and the last thing
   to be drawn.

   The arc is dashed, so it cannot be drawn on with stroke-dashoffset — the
   dash pattern is already the dasharray. A solid path of identical geometry
   sweeps as a mask over it instead. */

const STATIONS = [
  {
    label: "REQUEST",
    x: 44,
    title: "Request",
    body: "A call to the office, or a booking from the passenger app. Both land in the same place.",
  },
  {
    label: "BOARD",
    x: 175,
    title: "Board",
    body: "The ride is placed — automatically on the nearest free car, or by hand when dispatch knows better.",
  },
  {
    label: "CAR",
    x: 306,
    title: "Car",
    body: "The offer reaches a driver with a countdown. No answer, and it moves on by itself.",
  },
  {
    label: "RIDE",
    x: 437,
    title: "Ride",
    body: "Turn-by-turn to the pickup and on to the drop-off, with the passenger watching the car move.",
  },
  {
    label: "SETTLE",
    x: 568,
    title: "Settle",
    body: "Card captured at the end of the ride, cash entered in two taps. Either way the fare is known.",
  },
];

const ARC =
  "M568 96 L568 142 Q568 156 554 156 L189 156 Q175 156 175 142 L175 100";

const BRASS = "#c4a06a";
const GREY = "#79828a";

export function DispatchLoop({ children }: { children: React.ReactNode }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const axisRef = useRef<SVGPathElement>(null);
  const sweepRef = useRef<SVGPathElement>(null);
  const [built, setBuilt] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = (path: SVGPathElement | null, dur: number, delay: number) => {
      if (!path) return;
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len} ${len}`;
      path.style.strokeDashoffset = still ? "0" : String(len);
      if (still) return;
      path.getBoundingClientRect();
      path.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(.22,.61,.36,1) ${delay}ms`;
      path.style.strokeDashoffset = "0";
    };

    /* Reduced motion takes the same path with zero durations, rather than a
       separate branch — the state change has to come from the observer
       callback, not the effect body. */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          setBuilt(true);
          draw(axisRef.current, still ? 0 : 620, 0);
          draw(sweepRef.current, still ? 0 : 950, still ? 0 : 900);
          io.disconnect();
        });
      },
      { rootMargin: "-90px" }
    );
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  const lit = (i: number) => active === i;

  const s = active === null ? null : STATIONS[active];

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-[4.5rem]">
      <div>
        {children}
        <div className="mt-7 border-l-2 border-brass pl-[1.1rem]">
          <p className="label text-brass">{s ? s.title : "Hover the drawing"}</p>
          <p className="mt-1.5 max-w-[44ch] text-[0.9375rem] text-fg-2">
            {s ? s.body : "Five stations, and the arc that closes them."}
          </p>
        </div>
      </div>

      <svg
      ref={svgRef}
      viewBox="0 0 620 190"
      className="h-auto w-full"
      role="img"
      aria-label="Diagram: the dispatch loop — request, board, car, ride, settle, with a return arc labelled record closing back onto the board"
      onPointerLeave={() => setActive(null)}
    >
      <defs>
        <mask id="fig02-sweep" maskUnits="userSpaceOnUse" x="0" y="0" width="620" height="190">
          <path
            ref={sweepRef}
            d={ARC}
            fill="none"
            stroke="#fff"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </mask>
      </defs>

      {/* Labels sit above the axis so the return arc lands clear of the type */}
      <g
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.12em"
        textAnchor="middle"
      >
        {STATIONS.map((s, i) => (
          <text
            key={s.label}
            x={s.x}
            y={52}
            fill={lit(i) ? BRASS : GREY}
            opacity={built ? 1 : 0}
            style={{
              transition: "opacity .5s ease, fill .35s ease",
              transitionDelay: `${320 + i * 90}ms, 0ms`,
            }}
          >
            {s.label}
          </text>
        ))}
      </g>

      <path
        ref={axisRef}
        d="M44 80 L568 80"
        stroke="var(--rule-2)"
        strokeWidth="1"
      />

      {STATIONS.map((s, i) => (
        <rect
          key={s.label}
          x={s.x - 8}
          y={72}
          width="16"
          height="16"
          fill={lit(i) ? "rgba(196,160,106,0.14)" : "none"}
          stroke={lit(i) ? BRASS : GREY}
          strokeWidth={lit(i) ? 1.5 : 1.15}
          opacity={built ? 1 : 0}
          style={{
            transition: "opacity .5s ease, stroke .35s ease, fill .35s ease",
            transitionDelay: `${260 + i * 90}ms, 0ms, 0ms`,
          }}
        />
      ))}

      <g fill="none" strokeWidth="1">
        {STATIONS.slice(1).map((s, i) => (
          <path
            key={s.label}
            d={`M${s.x - 75} 76 L${s.x - 67} 80 L${s.x - 75} 84`}
            stroke={lit(i + 1) ? BRASS : GREY}
            opacity={built ? 1 : 0}
            style={{
              transition: "opacity .5s ease, stroke .35s ease",
              transitionDelay: `${300 + i * 90}ms, 0ms`,
            }}
          />
        ))}
      </g>

      <g mask="url(#fig02-sweep)">
        <path
          d={ARC}
          fill="none"
          stroke={BRASS}
          strokeWidth="1.2"
          strokeDasharray="2 5"
        />
      </g>

      <path
        d="M170 108 L175 98 L180 108"
        fill="none"
        stroke={BRASS}
        strokeWidth="1.2"
        opacity={built ? 1 : 0}
        style={{ transition: "opacity .45s ease", transitionDelay: "1800ms" }}
      />
      <text
        x="371"
        y="176"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.12em"
        fill={BRASS}
        textAnchor="middle"
        opacity={built ? 1 : 0}
        style={{ transition: "opacity .45s ease", transitionDelay: "1800ms" }}
      >
        RECORD
      </text>

      <g fill="transparent" style={{ pointerEvents: "all" }}>
        {STATIONS.map((s, i) => (
          <rect
            key={s.label}
            x={i === 0 ? 0 : s.x - 65}
            y={30}
            width={i === 0 ? 109 : i === STATIONS.length - 1 ? 620 - (s.x - 65) : 131}
            height={60}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
          />
        ))}
      </g>
      </svg>
    </div>
  );
}
