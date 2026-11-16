"use server";

import { Resend } from "resend";
import { DEMO_FIELDS, type DemoAnswers } from "./demoFields";

/* The contact form and the demo questionnaire, emailed to Vellon through
   Resend (RESEND_API_KEY in Vercel, Production and Preview).

   One email per submission and NO confirmation to the sender, on purpose:
   the Resend account is on the free plan (100 a day) and also sends
   dispatcher sign-in codes, so a flood of form posts must not be able to
   exhaust it, and an auto-reply would let anyone make no-reply@vellon.ca mail
   any address they type. The page itself confirms receipt. Bots are dropped
   silently by a hidden field and a minimum fill-in time; a Vercel Firewall
   rate limit on /contact and /demo is the backstop. */

const TO = "hello@vellon.ca";
const FROM = "Vellon Dispatch website <no-reply@vellon.ca>";
const MIN_FILL_MS = 3000;

export type FormResult = { ok: true } | { ok: false; error: string };

const FALLBACK = `Something went wrong sending this. Please email us at ${TO}.`;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clip = (s: unknown, max = 2000) => String(s ?? "").trim().slice(0, max);
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const looksLikeBot = (trap: unknown, startedAt: unknown) =>
  clip(trap) !== "" || !Number(startedAt) || Date.now() - Number(startedAt) < MIN_FILL_MS;

async function send(subject: string, replyTo: string, rows: [string, string][]): Promise<FormResult> {
  if (!process.env.RESEND_API_KEY) {
    console.error("forms: RESEND_API_KEY is not set");
    return { ok: false, error: FALLBACK };
  }
  const body = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b6b70;vertical-align:top;white-space:nowrap">${esc(k)}</td>` +
        `<td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join("");
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: FROM,
      to: [TO],
      replyTo,
      subject,
      html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#0b0b0c">
        <h2 style="margin:0 0 16px">${esc(subject)}</h2><table style="border-collapse:collapse">${body}</table></div>`,
    });
    if (error) {
      console.error("forms: Resend error", error);
      return { ok: false, error: FALLBACK };
    }
    return { ok: true };
  } catch (err) {
    console.error("forms: send failed", err);
    return { ok: false, error: FALLBACK };
  }
}

export async function sendContact(input: {
  name: string;
  email: string;
  company?: string;
  message: string;
  website?: string;
  startedAt: number;
}): Promise<FormResult> {
  if (looksLikeBot(input.website, input.startedAt)) return { ok: true };
  const name = clip(input.name, 200);
  const email = clip(input.email, 200);
  const company = clip(input.company, 200);
  const message = clip(input.message, 5000);
  if (!name || !email || !message) return { ok: false, error: "Please fill in your name, email and message." };
  if (!isEmail(email)) return { ok: false, error: "Please enter a valid email address." };
  return send(`Message from ${name}${company ? ` (${company})` : ""}`, email, [
    ["Name", name],
    ["Email", email],
    ["Company", company],
    ["Message", message],
  ]);
}

export async function sendDemoRequest(input: {
  answers: DemoAnswers;
  website?: string;
  startedAt: number;
}): Promise<FormResult> {
  if (looksLikeBot(input.website, input.startedAt)) return { ok: true };
  const a = input.answers ?? {};
  const value = (id: string): string => {
    const v = a[id];
    return Array.isArray(v) ? v.map((x) => clip(x, 200)).filter(Boolean).join(", ") : clip(v);
  };
  for (const f of DEMO_FIELDS) {
    if (f.required && !value(f.id)) return { ok: false, error: `Please answer “${f.label}”.` };
  }
  const email = value("email");
  if (!isEmail(email)) return { ok: false, error: "Please enter a valid email address." };
  const company = value("company");
  return send(
    `Demo request: ${company} (${value("city")})`,
    email,
    DEMO_FIELDS.map((f) => [f.label, value(f.id)] as [string, string]),
  );
}
