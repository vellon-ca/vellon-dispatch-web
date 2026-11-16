"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { sendContact } from "@/lib/forms";

const inputCls =
  "mt-2.5 w-full rounded-xl border border-rule-2 bg-white px-4 py-3 text-[0.9375rem] text-fg placeholder:text-fg-3 focus:border-[var(--accent)] focus:outline-none";

export function ContactForm() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  if (done) {
    return (
      <div className="rounded-3xl bg-surface p-8 md:p-10">
        <h2 className="font-display text-2xl font-bold">Message sent.</h2>
        <p className="mt-3 max-w-[44ch] leading-relaxed text-fg-2">
          Thanks. We read every message and will reply within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setError(null);
        startTransition(async () => {
          const res = await sendContact({
            name: String(fd.get("name") ?? ""),
            email: String(fd.get("email") ?? ""),
            company: String(fd.get("company") ?? ""),
            message: String(fd.get("message") ?? ""),
            website: String(fd.get("website") ?? ""),
            startedAt: startedAt.current,
          });
          if (res.ok) setDone(true);
          else setError(res.error);
        });
      }}
      className="rounded-3xl border border-rule p-6 md:p-9"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="text-[0.9375rem] font-semibold">Name</label>
          <input id="c-name" name="name" required autoComplete="name" className={inputCls} />
        </div>
        <div>
          <label htmlFor="c-email" className="text-[0.9375rem] font-semibold">Email</label>
          <input id="c-email" name="email" type="email" required autoComplete="email" className={inputCls} />
        </div>
      </div>
      <div className="mt-6">
        <label htmlFor="c-company" className="text-[0.9375rem] font-semibold">
          Company <span className="font-normal text-fg-3">(optional)</span>
        </label>
        <input id="c-company" name="company" autoComplete="organization" className={inputCls} />
      </div>
      <div className="mt-6">
        <label htmlFor="c-message" className="text-[0.9375rem] font-semibold">Message</label>
        <textarea id="c-message" name="message" required rows={6} className={`${inputCls} resize-y`} />
      </div>
      {/* Hidden from people; bots fill it. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
      {error && (
        <p role="alert" className="mt-6 text-sm font-medium text-[#b42318]">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-accent mt-8 disabled:opacity-60">
        {pending ? "Sending…" : "Send message"}
      </button>
      <p className="mt-5 text-[0.8125rem] leading-relaxed text-fg-3">
        We use what you send only to reply. See our{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
