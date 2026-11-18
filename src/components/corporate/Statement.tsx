"use client";

import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  money, monthName, STATEMENT_STATUS, statementCsv, zonedDate,
  type StatementDetail, type StatementLine,
} from "@/lib/corporate";

/* One statement, as the document the taxi company issued. Print is the PDF
   here (the print stylesheet hides everything but the document); the email
   also attaches one. Everything comes off the frozen statement, so this page
   always matches what was emailed. */
export default function Statement({
  supabase, id, onBack, onAccount,
}: {
  supabase: SupabaseClient;
  id: string;
  onBack: () => void;
  /** The statement's account, so the shell can switch to it after a deep link. */
  onAccount: (accountId: string) => void;
}) {
  const [d, setD] = useState<StatementDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    supabase.rpc("ba_get_statement", { p_statement: id }).then(({ data, error: e }) => {
      if (!alive) return;
      if (e || !data?.ok) {
        setError(data?.reason === "forbidden"
          ? "This statement isn't on an account you manage."
          : "We couldn't load this statement. Refresh to try again.");
        return;
      }
      setD(data as StatementDetail);
      onAccount((data as StatementDetail).statement.account_id);
    });
    return () => {
      alive = false;
    };
    // onAccount is a state setter wrapper; reloading on it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, id]);

  // Named teams first, "No team" last.
  const groups = useMemo(() => {
    const m = new Map<string, StatementLine[]>();
    const lines = d?.lines ?? [];
    for (const l of [...lines.filter((x) => x.team_name), ...lines.filter((x) => !x.team_name)]) {
      const k = l.team_name ?? "No team";
      m.set(k, [...(m.get(k) ?? []), l]);
    }
    return [...m];
  }, [d]);

  function downloadCsv() {
    if (!d) return;
    const url = URL.createObjectURL(new Blob([statementCsv(d)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${d.statement.number}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (error) {
    return (
      <main className="cp-main cp-narrow">
        <button className="cp-link" onClick={onBack}>‹ Statements</button>
        <div className="cp-banner" style={{ color: "var(--red)", marginTop: 14 }}>{error}</div>
      </main>
    );
  }
  if (!d) return <main className="cp-main cp-narrow"><div className="cp-empty">Loading…</div></main>;

  const s = d.statement;
  const tz = s.time_zone;
  const rates = [...new Set(d.lines.map((l) => l.tax_rate_percent).filter((r) => r != null).map(Number))].sort();
  const taxed = !!s.hst_number && rates.length > 0;
  const late = d.lines.some((l) => l.ride_month !== s.month);
  const sum = (ls: StatementLine[], k: "fare_cents" | "booking_fee_cents" | "total_cents") =>
    ls.reduce((a, l) => a + Number(l[k]), 0);
  const owing = Math.max(0, s.total_cents - s.paid_cents);
  // "Atlantic Time", not a clock reading or a standard/daylight variant.
  const zoneName = new Intl.DateTimeFormat("en-CA", { timeZone: tz, timeZoneName: "longGeneric" })
    .formatToParts(new Date(s.issued_at)).find((p) => p.type === "timeZoneName")?.value;

  return (
    <main className="cp-main cp-narrow">
      <div className="cp-docbar cp-noprint">
        <button className="cp-link" onClick={onBack}>‹ Statements</button>
        <div className="cp-filters">
          <button className="cp-btn" onClick={downloadCsv}>Download CSV</button>
          <button className="cp-btn" onClick={() => window.print()}>Print or save as PDF</button>
        </div>
      </div>

      {s.status === "void" && (
        <div className="cp-banner">
          <span className="cp-dot" style={{ background: "var(--text-3)" }} />
          {s.company_name} withdrew this statement{s.void_reason ? `: ${s.void_reason}` : ""}. Its rides go on a new statement.
        </div>
      )}

      <article className="cp-doc">
        <header className="cp-doc-head">
          <div>
            <div className="cp-doc-co">{s.company_name}</div>
            <div className="cp-hint">{[s.company_address, s.company_phone, s.company_email].filter(Boolean).join(" · ")}</div>
            {taxed && <div className="cp-hint">{s.tax_label} Reg: {s.hst_number}</div>}
          </div>
          <div className="cp-doc-id">
            <div className="cp-doc-k">Statement</div>
            <div className="cp-doc-no">{s.number}</div>
            <div className="cp-hint">Rides completed in {monthName(s.month)}</div>
          </div>
        </header>

        <div className="cp-doc-meta">
          <div><div className="cp-doc-k">Account</div><b>{s.account_name}</b></div>
          <div><div className="cp-doc-k">Issued</div><b>{zonedDate(s.issued_at, tz, { dateStyle: "long" })}</b></div>
          <div>
            <div className="cp-doc-k">Total</div><b>{money(s.total_cents)}</b>
            <div className="cp-hint">{s.ride_count} {s.ride_count === 1 ? "ride" : "rides"} · booking fees included</div>
          </div>
          <div><div className="cp-doc-k">Payment terms</div><b>{s.payment_terms ?? "—"}</b></div>
          <div>
            <div className="cp-doc-k">Status</div>
            <b className="cp-status" style={{ fontSize: 15 }}>
              <span className="cp-dot" style={{ background: STATEMENT_STATUS[s.status].color }} />
              {s.status === "owing" || s.status === "part_paid" ? `Owing ${money(owing)}` : STATEMENT_STATUS[s.status].label}
            </b>
          </div>
        </div>
        {taxed && <p className="cp-hint" style={{ margin: "0 0 14px" }}>All amounts include {s.tax_label} at {rates.map((r) => `${r}%`).join(" / ")}.</p>}

        <div className="cp-doc-k">By team</div>
        <div className="cp-table-wrap">
          <table className="cp-table cp-doc-table">
            <thead><tr><th>Team</th><th className="cp-num">Rides</th><th className="cp-num">Fares</th><th className="cp-num">Booking fees</th><th className="cp-num">Total</th></tr></thead>
            <tbody>
              {groups.map(([name, ls]) => (
                <tr key={name}>
                  <td>{name}</td><td className="cp-num">{ls.length}</td>
                  <td className="cp-num">{money(sum(ls, "fare_cents"))}</td>
                  <td className="cp-num">{money(sum(ls, "booking_fee_cents"))}</td>
                  <td className="cp-num">{money(sum(ls, "total_cents"))}</td>
                </tr>
              ))}
              <tr className="cp-total">
                <td>Total</td><td className="cp-num">{s.ride_count}</td>
                <td className="cp-num">{money(s.fares_cents)}</td>
                <td className="cp-num">{money(s.booking_fees_cents)}</td>
                <td className="cp-num">{money(s.total_cents)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {groups.map(([name, ls]) => (
          <section key={name} className="cp-doc-group">
            <h2>{name} · {ls.length} {ls.length === 1 ? "ride" : "rides"}</h2>
            <div className="cp-table-wrap">
              <table className="cp-table cp-doc-table cp-doc-rides">
                <thead>
                  <tr><th>Pickup</th><th>Rider</th><th>From</th><th>To</th><th className="cp-num">Fare</th><th className="cp-num">Fee</th><th className="cp-num">Total</th></tr>
                </thead>
                <tbody>
                  {ls.map((l) => (
                    <tr key={l.id}>
                      <td className="cp-nowrap">
                        {zonedDate(l.pickup_at, tz, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                        {l.ride_month !== s.month && <span className="cp-chip">{monthName(l.ride_month, "short")}</span>}
                      </td>
                      <td>{l.rider_name}</td>
                      <td className="cp-muted">{l.pickup_address}</td>
                      <td className="cp-muted">{l.dropoff_address}</td>
                      <td className="cp-num">{money(l.fare_cents)}</td>
                      <td className="cp-num">{money(l.booking_fee_cents)}</td>
                      <td className="cp-num">{money(l.total_cents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {d.payments.length > 0 && (
          <section className="cp-doc-group">
            <h2>Payments received</h2>
            {d.payments.map((p) => (
              <div key={p.id} className="cp-kv">
                <span>{zonedDate(p.received_on, "UTC", { dateStyle: "long" })}{p.note ? ` · ${p.note}` : ""}</span>
                <b>{money(p.amount_cents)}</b>
              </div>
            ))}
          </section>
        )}

        <footer className="cp-doc-foot">
          <span>
            {late && "A ride marked with its month finished late and was not on that month's statement. "}
            Pickup times are {s.company_name}&apos;s local time{zoneName ? ` (${zoneName})` : ""}. Amounts in CAD.
          </span>
          <span>Statement prepared by Vellon for {s.company_name}</span>
        </footer>
      </article>
    </main>
  );
}
