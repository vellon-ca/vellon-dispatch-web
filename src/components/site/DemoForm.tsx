"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { DEMO_STEPS, type DemoAnswers, type DemoField } from "@/lib/demoFields";
import { sendDemoRequest } from "@/lib/forms";

const inputCls =
  "w-full rounded-xl border border-rule-2 bg-white px-4 py-3 text-[0.9375rem] text-fg placeholder:text-fg-3 focus:border-[var(--accent)] focus:outline-none";

export function DemoForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DemoAnswers>({});
  const [missing, setMissing] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const startedAt = useRef(0);
  const trap = useRef<HTMLInputElement>(null);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const current = DEMO_STEPS[step];
  const last = step === DEMO_STEPS.length - 1;

  const set = (id: string, v: string | string[]) => {
    setAnswers((a) => ({ ...a, [id]: v }));
    setMissing((m) => m.filter((x) => x !== id));
  };
  const toggle = (id: string, option: string) => {
    const cur = Array.isArray(answers[id]) ? (answers[id] as string[]) : [];
    set(id, cur.includes(option) ? cur.filter((x) => x !== option) : [...cur, option]);
  };
  const filled = (f: DemoField) => {
    const v = answers[f.id];
    return Array.isArray(v) ? v.length > 0 : !!v?.trim();
  };

  const goTo = (n: number) => {
    setStep(n);
    setError(null);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = () => {
    const gaps = current.fields.filter((f) => f.required && !filled(f)).map((f) => f.id);
    if (gaps.length) {
      setMissing(gaps);
      return;
    }
    if (!last) return goTo(step + 1);
    setError(null);
    startTransition(async () => {
      const res = await sendDemoRequest({ answers, website: trap.current?.value, startedAt: startedAt.current });
      if (res.ok) setDone(true);
      else setError(res.error);
    });
  };

  if (done) {
    return (
      <div ref={top} className="rounded-3xl bg-surface p-8 md:p-12">
        <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="m5 12 5 5 9-10" />
          </svg>
        </span>
        <h2 className="font-display mt-6 text-3xl font-bold">Thanks, we&rsquo;ve got it.</h2>
        <p className="mt-3 max-w-[48ch] leading-relaxed text-fg-2">
          We&rsquo;ll be in touch within one business day to set up a time. If it&rsquo;s urgent, email{" "}
          <a href="mailto:hello@vellon.ca" className="underline underline-offset-2 hover:text-[var(--accent)]">
            hello@vellon.ca
          </a>
          .
        </p>
        <Link href="/" className="btn btn-outline mt-8">
          Back to the home page
        </Link>
      </div>
    );
  }

  return (
    <div ref={top} className="scroll-mt-24">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <p className="font-semibold">
          Step {step + 1} of {DEMO_STEPS.length}: {current.title}
        </p>
        <p className="text-fg-3">About 2 minutes</p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300"
          style={{ width: `${((step + 1) / DEMO_STEPS.length) * 100}%` }}
        />
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        className="mt-8 rounded-3xl border border-rule p-6 md:p-9"
      >
        <p className="text-fg-2">{current.intro}</p>
        <div className="mt-7 flex flex-col gap-7">
          {current.fields.map((f) => (
            <Field
              key={f.id}
              field={f}
              value={answers[f.id]}
              invalid={missing.includes(f.id)}
              onText={(v) => set(f.id, v)}
              onToggle={(o) => toggle(f.id, o)}
            />
          ))}
        </div>

        {/* Hidden from people; bots fill it. */}
        <input ref={trap} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

        {missing.length > 0 && (
          <p role="alert" className="mt-7 text-sm font-medium text-[#b42318]">
            Please answer the questions marked required.
          </p>
        )}
        {error && (
          <p role="alert" className="mt-7 text-sm font-medium text-[#b42318]">
            {error}
          </p>
        )}

        <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-7">
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} className="btn btn-outline">
              Back
            </button>
          ) : (
            <span />
          )}
          <button type="submit" disabled={pending} className="btn btn-accent disabled:opacity-60">
            {last ? (pending ? "Sending…" : "Send request") : "Next"}
          </button>
        </div>
        {last && (
          <p className="mt-5 text-[0.8125rem] leading-relaxed text-fg-3">
            We use what you send only to reply and talk with you about Vellon. See our{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              privacy policy
            </Link>
            .
          </p>
        )}
      </form>
    </div>
  );
}

function Field({
  field: f,
  value,
  invalid,
  onText,
  onToggle,
}: {
  field: DemoField;
  value: string | string[] | undefined;
  invalid: boolean;
  onText: (v: string) => void;
  onToggle: (option: string) => void;
}) {
  const label = (
    <>
      {f.label}
      {f.required ? <span className="text-[var(--accent)]"> *</span> : <span className="font-normal text-fg-3"> (optional)</span>}
    </>
  );
  const hint = f.hint ? <p className="mt-1.5 text-[0.8125rem] text-fg-3">{f.hint}</p> : null;
  const ring = invalid ? " !border-[#b42318]" : "";

  if (f.kind === "choice" || f.kind === "multi") {
    const selected = Array.isArray(value) ? value : value ? [value] : [];
    return (
      <fieldset aria-invalid={invalid || undefined}>
        <legend className="text-[0.9375rem] font-semibold">{label}</legend>
        {hint}
        <div className="mt-3 flex flex-wrap gap-2">
          {f.options.map((o) => {
            const on = selected.includes(o);
            return (
              <label
                key={o}
                className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-4 text-[0.9375rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--accent)] ${
                  on ? "border-[var(--accent)] bg-[#eef2fd] font-medium text-fg" : `border-rule-2 text-fg-2 hover:border-fg-3${ring}`
                }`}
              >
                <input
                  type={f.kind === "multi" ? "checkbox" : "radio"}
                  name={f.id}
                  value={o}
                  checked={on}
                  onChange={() => (f.kind === "multi" ? onToggle(o) : onText(o))}
                  className="sr-only"
                />
                {f.kind === "multi" && (
                  <span
                    aria-hidden="true"
                    className={`flex h-4 w-4 items-center justify-center rounded border ${on ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-rule-2"}`}
                  >
                    {on && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                        <path d="m5 12 5 5 9-10" />
                      </svg>
                    )}
                  </span>
                )}
                {o}
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  const v = typeof value === "string" ? value : "";
  return (
    <div>
      <label htmlFor={`demo-${f.id}`} className="text-[0.9375rem] font-semibold">
        {label}
      </label>
      {hint}
      {f.kind === "textarea" ? (
        <textarea
          id={`demo-${f.id}`}
          rows={4}
          value={v}
          placeholder={f.placeholder}
          onChange={(e) => onText(e.target.value)}
          className={`${inputCls} mt-2.5 resize-y${ring}`}
        />
      ) : (
        <input
          id={`demo-${f.id}`}
          type={f.kind}
          value={v}
          placeholder={f.placeholder}
          autoComplete={f.autoComplete}
          aria-invalid={invalid || undefined}
          onChange={(e) => onText(e.target.value)}
          className={`${inputCls} mt-2.5${ring}`}
        />
      )}
    </div>
  );
}
