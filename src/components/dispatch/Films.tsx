"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* The three films, played in a panel over the page.

   The transport is ours rather than the browser's, and it sits *inside* the
   frame the way a video player's does: a scrim at the head carrying the title
   and the way out, a scrim at the foot carrying a hairline scrub track with a
   brass fill, a square play/pause and a mono time readout. It fades out while
   the film runs and comes back on the first sign of a pointer, a tap or a key.

   The fill is driven by a --p custom property because Firefox paints
   ::-moz-range-track over the input's own background, so setting it on the
   element alone would show nothing there.

   Full screen takes the whole player, not the bare <video>, so the transport
   goes with it. Where element full screen doesn't exist at all — iPhone
   Safari — it falls back to the video's own native full screen, and if
   neither is on offer the button isn't drawn. */

const FILMS = [
  {
    id: "a",
    title: "The dispatch board",
    dur: "1:43",
    body: "Booking a call-in, auto-assign, a manual override, and the day's record",
    src: "/media/film-a.mp4",
    poster: "/media/film-a.jpg",
  },
  {
    id: "b",
    title: "The passenger app",
    dur: "1:06",
    body: "Search, fare, driver assigned, and the car tracked to the door",
    src: "/media/film-b.mp4",
    poster: "/media/film-b.jpg",
  },
  {
    id: "c",
    title: "The driver app",
    dur: "1:15",
    body: "Going online, an offer, navigation, and closing out a cash fare",
    src: "/media/film-c.mp4",
    poster: "/media/film-c.jpg",
  },
];

const HIDE_MS = 2600;

const clock = (sec: number) => {
  const s = Math.max(0, Math.floor(sec || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const fullscreenEl = () =>
  document.fullscreenElement ??
  (document as unknown as { webkitFullscreenElement?: Element | null })
    .webkitFullscreenElement ??
  null;

export function Films() {
  const [open, setOpen] = useState<number | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fs, setFs] = useState(false);
  const [fsOk, setFsOk] = useState(false);
  const [chrome, setChrome] = useState(true);

  const scrubbing = useRef(false);
  /* The transport's visibility, mirrored, because a tap has to be judged
     against what was on screen when the finger landed — by the time the
     click handler runs, the pointer handlers have already woken it. */
  const chromeRef = useRef(true);
  const wasVisible = useRef(true);
  /* A control has keyboard focus, or a finger is on the track — the transport
     must not fade out from under it. */
  const held = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Arms the fade, and keeps re-arming while the film is held — paused, or
     with a finger on the track or focus on a control. */
  const scheduleHide = useCallback(() => {
    const arm = () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        const v = videoRef.current;
        if (!v || v.paused || scrubbing.current || held.current) {
          arm();
          return;
        }
        chromeRef.current = false;
        setChrome(false);
      }, HIDE_MS);
    };
    arm();
  }, []);

  const reveal = useCallback(() => {
    chromeRef.current = true;
    setChrome(true);
  }, []);

  /* Any sign of life brings the transport back and restarts its clock. */
  const bump = useCallback(() => {
    reveal();
    scheduleHide();
  }, [reveal, scheduleHide]);

  const close = useCallback(() => {
    const teardown = () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.removeAttribute("src");
        v.load();
      }
      setOpen(null);
      setTime(0);
      setDuration(0);
      chromeRef.current = true;
      setChrome(true);
      document.body.style.overflow = "";
      lastFocus.current?.focus();
    };
    /* Pulling the full screen element out of the document mid-transition can
       leave the document's full screen flag set and the page scroll-locked,
       so the exit has to land first. */
    if (fullscreenEl() && document.exitFullscreen) {
      document.exitFullscreen().then(teardown, teardown);
      return;
    }
    teardown();
  }, []);

  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    playerRef.current?.focus();
    /* The panel opened from a click, so this is still inside the user
       gesture — saves a second press. Refused, and the poster stays with the
       transport showing Play. */
    videoRef.current?.play()?.catch(() => {});
    scheduleHide();

    const p = playerRef.current as (HTMLDivElement & {
      webkitRequestFullscreen?: () => void;
    }) | null;
    const v = videoRef.current as (HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
    }) | null;
    setFsOk(
      Boolean(
        document.fullscreenEnabled ||
          (document as unknown as { webkitFullscreenEnabled?: boolean })
            .webkitFullscreenEnabled ||
          p?.webkitRequestFullscreen ||
          v?.webkitEnterFullscreen
      )
    );

    const onKey = (e: KeyboardEvent) => {
      /* In full screen, Escape belongs to the browser — it leaves full
         screen, and the panel stays where it was. */
      if (e.key === "Escape" && !fullscreenEl()) close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [open, close, scheduleHide]);

  useEffect(() => {
    const onChange = () => {
      setFs(Boolean(fullscreenEl()));
      bump();
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, [bump]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play()?.catch(() => {});
    else v.pause();
  }, []);

  const toggleFs = useCallback(() => {
    if (fullscreenEl()) {
      document.exitFullscreen?.()?.catch(() => {});
      return;
    }
    const p = playerRef.current as (HTMLDivElement & {
      webkitRequestFullscreen?: () => void;
    }) | null;
    if (p?.requestFullscreen) {
      p.requestFullscreen().catch(() => {});
      return;
    }
    if (p?.webkitRequestFullscreen) {
      p.webkitRequestFullscreen();
      return;
    }
    /* iPhone Safari has no element full screen — the video goes full screen
       on its own, wearing the system transport instead of ours. */
    const v = videoRef.current as (HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
    }) | null;
    v?.webkitEnterFullscreen?.();
  }, []);

  const film = open === null ? null : FILMS[open];
  const pct = duration ? Math.min(100, (time / duration) * 100) : 0;

  /* Buttons sitting on the film: square, hairline, brass on hover. */
  const btn =
    "grid h-7 w-7 flex-none place-items-center border border-rule-2 bg-[rgba(9,10,12,0.5)] text-fg-2 transition-colors hover:border-brass-dim hover:text-brass focus-visible:border-brass focus-visible:text-brass focus-visible:outline-none sm:h-8 sm:w-8";

  return (
    <>
      <div className="border-t border-rule">
        {FILMS.map((f, i) => (
          <button
            key={f.id}
            type="button"
            onClick={(e) => {
              lastFocus.current = e.currentTarget;
              setOpen(i);
            }}
            className="index-row group grid w-full grid-cols-1 items-center gap-x-8 gap-y-4 border-b border-rule px-1 py-7 text-left hover:bg-surface-2 md:grid-cols-[12rem_3rem_minmax(0,1fr)_6rem] md:py-6"
          >
            {/* Full-resolution, because the same file is the panel's poster —
                one fetch serves the 12rem thumbnail and the 70rem still. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={f.poster}
              alt=""
              loading="lazy"
              decoding="async"
              className="block h-auto w-full border border-rule-2"
            />
            <span className="numeral text-[0.8125rem] text-fg-3">{f.dur}</span>
            <span>
              <span className="block text-[1.05rem] font-medium tracking-[-0.015em] text-fg">
                {f.title}
              </span>
              <span className="mt-1 block max-w-[52ch] text-[0.9375rem] text-fg-2">
                {f.body}
              </span>
            </span>
            <span className="label transition-colors duration-400 group-hover:text-brass md:justify-self-end">
              Play &rarr;
            </span>
          </button>
        ))}
      </div>

      {film && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-[rgba(9,10,12,0.93)] p-0 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="w-[min(70rem,100%)]">
            <div
              ref={playerRef}
              className={`film-player relative border-y border-rule-2 bg-black sm:border ${
                chrome ? "" : "cursor-none"
              }`}
              tabIndex={-1}
              onPointerMove={bump}
              onPointerDown={(e) => {
                wasVisible.current =
                  e.pointerType === "mouse" ? true : chromeRef.current;
                bump();
              }}
            >
              <video
                ref={videoRef}
                src={film.src}
                poster={film.poster}
                playsInline
                autoPlay
                onLoadedMetadata={(e) =>
                  setDuration(e.currentTarget.duration || 0)
                }
                onTimeUpdate={(e) => {
                  if (!scrubbing.current) setTime(e.currentTarget.currentTime);
                }}
                onPlay={() => {
                  setPaused(false);
                  bump();
                }}
                onPause={() => {
                  /* Paused is a held state, not a lull — the transport stays
                     up until the film runs again. */
                  setPaused(true);
                  reveal();
                }}
                onEnded={() => {
                  setPaused(true);
                  reveal();
                }}
                onClick={() => {
                  /* On a touch screen the first tap only wakes the transport;
                     it takes a second one to stop the film. */
                  if (wasVisible.current) togglePlay();
                }}
                className="block h-auto w-full bg-black"
              />

              {/* Head — title, running time, and the way out. Inside the
                  frame so it survives full screen. */}
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 bg-gradient-to-b from-[rgba(9,10,12,0.8)] to-transparent p-2 transition-opacity duration-300 sm:p-4 ${
                  chrome ? "opacity-100" : "opacity-0"
                }`}
                /* Tabbing to Close while the transport is down has to bring
                   it back up, or the focus ring lands on nothing. */
                onFocusCapture={() => {
                  held.current = true;
                  bump();
                }}
                onBlurCapture={() => (held.current = false)}
              >
                <p className="label text-fg-2">
                  {film.title}
                  <span className="hidden sm:inline"> — {film.dur}</span>
                </p>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={close}
                  className={`${chrome ? "pointer-events-auto" : ""} ${btn}`}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                    <path
                      d="M0 0l10 10M10 0L0 10"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                  </svg>
                </button>
              </div>

              {/* Foot — the track runs the full width, the transport sits
                  under it. Two rows, so it still fits a phone held upright. */}
              <div
                className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(9,10,12,0.9)] to-transparent px-2 pb-1.5 pt-7 transition-opacity duration-300 sm:px-4 sm:pb-3 sm:pt-9 ${
                  chrome
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
                onFocusCapture={() => {
                  held.current = true;
                  bump();
                }}
                onBlurCapture={() => (held.current = false)}
              >
                <input
                  type="range"
                  min={0}
                  max={1000}
                  value={duration ? Math.round((time / duration) * 1000) : 0}
                  aria-label={`Seek ${film.title}`}
                  onPointerDown={() => {
                    scrubbing.current = true;
                    held.current = true;
                  }}
                  onPointerUp={() => {
                    scrubbing.current = false;
                    held.current = false;
                    bump();
                  }}
                  onKeyDown={() => (scrubbing.current = true)}
                  onKeyUp={() => (scrubbing.current = false)}
                  onChange={(e) => {
                    const v = videoRef.current;
                    const t = (Number(e.target.value) / 1000) * duration;
                    setTime(t);
                    if (v) {
                      try {
                        v.currentTime = t;
                      } catch {}
                    }
                  }}
                  className="tp-seek w-full"
                  style={{ ["--p" as string]: `${pct.toFixed(2)}%` }}
                />

                <div className="flex items-center gap-2 sm:mt-1 sm:gap-3">
                  <button
                    type="button"
                    aria-label={paused ? "Play" : "Pause"}
                    onClick={togglePlay}
                    className={btn}
                  >
                    {paused ? (
                      <svg width="9" height="10" viewBox="0 0 9 10" aria-hidden>
                        <path d="M0 0 L9 5 L0 10 Z" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg width="8" height="10" viewBox="0 0 8 10" aria-hidden>
                        <path d="M0 0h3v10H0zM5 0h3v10H5z" fill="currentColor" />
                      </svg>
                    )}
                  </button>

                  <span className="numeral flex-none text-[0.6875rem] text-fg-2">
                    {clock(time)}
                    <span className="text-fg-3"> / {clock(duration)}</span>
                  </span>

                  <span className="flex-1" />

                  <button
                    type="button"
                    aria-label={muted ? "Unmute" : "Mute"}
                    onClick={() => {
                      const v = videoRef.current;
                      if (!v) return;
                      v.muted = !v.muted;
                      setMuted(v.muted);
                    }}
                    className={btn}
                  >
                    <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden>
                      <path
                        d="M0 4h2.6L6 1v10L2.6 8H0z"
                        fill="currentColor"
                      />
                      {muted ? (
                        <path
                          d="M9 4l4 4M13 4l-4 4"
                          stroke="currentColor"
                          strokeWidth="1.3"
                        />
                      ) : (
                        <path
                          d="M8.6 3.6a3.4 3.4 0 010 4.8M10.8 1.8a6.4 6.4 0 010 8.4"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          fill="none"
                        />
                      )}
                    </svg>
                  </button>

                  {fsOk && (
                    <button
                      type="button"
                      aria-label={fs ? "Leave full screen" : "Full screen"}
                      onClick={toggleFs}
                      className={btn}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        aria-hidden
                      >
                        {fs ? (
                          <path d="M4.5 0.5v4h-4M11.5 4.5h-4v-4M7.5 11.5v-4h4M0.5 7.5h4v4" />
                        ) : (
                          <path d="M0.5 4V0.5h3.5M8 0.5h3.5V4M11.5 8v3.5H8M4 11.5H0.5V8" />
                        )}
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <p className="label mt-3 px-3 text-[0.625rem] sm:px-0">
              Recorded in a demonstration environment. Figures are illustrative.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
