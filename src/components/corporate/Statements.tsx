"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { money, monthName, STATEMENT_STATUS, zonedDate, type ManagedAccount, type StatementRow } from "@/lib/corporate";

type Usage = { used_cents: number; monthly_limit_cents: number | null; month: string; billing_mode: string | null };

/* The account's statements: the month in progress, then every issued one.
   A statement is the taxi company's document; the business pays them however
   they agreed, and the company marks it paid. */
export default function Statements({
  supabase, account, onOpen,
}: { supabase: SupabaseClient; account: ManagedAccount; onOpen: (id: string) => void }) {
  const [rows, setRows] = useState<StatementRow[] | null>(null);
  const [owing, setOwing] = useState(0);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      supabase.rpc("ba_list_statements", { p_account: account.account_id }),
      supabase.rpc("ba_account_usage", { p_account: account.account_id }),
    ]).then(([l, u]) => {
      if (!alive) return;
      if (l.error || !l.data?.ok) {
        setError("We couldn't load your statements. Refresh to try again.");
        return;
      }
      setRows(l.data.statements as StatementRow[]);
      setOwing(Number(l.data.owing_cents));
      if (!u.error && u.data?.ok) setUsage(u.data as Usage);
    });
    return () => {
      alive = false;
    };
  }, [supabase, account.account_id]);

  const live = (rows ?? []).filter((r) => r.status !== "void");
  const lastPaid = live.map((r) => r.last_paid_on).filter(Boolean).sort().pop() ?? null;
  const nextIssue = usage ? new Date(Date.UTC(+usage.month.slice(0, 4), +usage.month.slice(5, 7), 1)) : null;
  const pct = usage?.monthly_limit_cents ? Math.min(100, (usage.used_cents / usage.monthly_limit_cents) * 100) : null;

  return (
    <main className="cp-main cp-narrow">
      <div className="cp-head">
        <div>
          <h1>Statements</h1>
          <p>
            From {account.company_name}, on the 1st of each month, for the rides completed the month before.
            Each one is emailed to every manager.
          </p>
        </div>
        <div className="cp-figures">
          <div><span>Owing</span><b>{money(owing)}</b></div>
          {lastPaid && <div><span>Last payment</span><b className="cp-figure-sm">{zonedDate(lastPaid, "UTC", { month: "short", day: "numeric" })}</b></div>}
        </div>
      </div>

      {error && <div className="cp-banner" style={{ color: "var(--red)" }}>{error}</div>}

      {usage?.billing_mode === "invoice" && (
        <section className="cp-card">
          <div className="cp-card-head">
            <span className="cp-card-title">This month · {monthName(usage.month)} · not issued yet</span>
            {nextIssue && <span className="cp-muted" style={{ fontSize: 12 }}>Issued {zonedDate(nextIssue.toISOString(), "UTC", { month: "short", day: "numeric" })}</span>}
          </div>
          <div className="cp-running">
            <span className="cp-muted" style={{ fontSize: 12 }}>Booked so far</span>
            <b>{money(usage.used_cents)}</b>
            {pct != null && (
              <div className="cp-meter" role="img" aria-label={`${Math.round(pct)}% of the monthly limit`}>
                <div style={{ width: `${pct}%` }} />
              </div>
            )}
            <span className="cp-hint">
              {usage.monthly_limit_cents ? `Limit ${money(usage.monthly_limit_cents)} per month. ` : ""}
              Rides can still change or be cancelled until they are done.
            </span>
          </div>
        </section>
      )}

      <section className="cp-card">
        <div className="cp-card-head">
          <span className="cp-card-title">Issued</span>
          <span className="cp-muted" style={{ fontSize: 12 }}>Every amount includes the booking fee</span>
        </div>
        {rows === null && !error ? (
          <div className="cp-empty">Loading…</div>
        ) : (rows ?? []).length === 0 ? (
          <div className="cp-empty">No statements yet. The first one arrives on the 1st after your first completed ride.</div>
        ) : (
          <div className="cp-table-wrap">
            <table className="cp-table">
              <thead>
                <tr>
                  <th>Statement</th><th>Month</th><th>Issued</th>
                  <th className="cp-num">Rides</th><th className="cp-num">Total</th><th className="cp-num">Paid</th>
                  <th>Status</th><th />
                </tr>
              </thead>
              <tbody>
                {(rows ?? []).map((r) => (
                  <tr key={r.id} className={r.status === "void" ? "cp-void" : undefined}>
                    <td className="cp-who">{r.number}</td>
                    <td>{monthName(r.month)}</td>
                    <td className="cp-muted">{zonedDate(r.issued_at, r.time_zone, { month: "short", day: "numeric" })}</td>
                    <td className="cp-num">{r.ride_count}</td>
                    <td className="cp-num cp-who">{money(r.total_cents)}</td>
                    <td className="cp-num cp-muted">{r.status === "void" ? "—" : money(r.paid_cents)}</td>
                    <td>
                      <span className="cp-status">
                        <span className="cp-dot" style={{ background: STATEMENT_STATUS[r.status].color }} />
                        {STATEMENT_STATUS[r.status].label}
                      </span>
                    </td>
                    <td className="cp-num"><button className="cp-link" onClick={() => onOpen(r.id)}>Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <div className="cp-foot">
        Pay {account.company_name}{" "}the way you&apos;ve agreed with them. They mark a statement paid when the money arrives.
        A question about a ride? Reply to the statement email and it reaches {account.company_name}.
      </div>
    </main>
  );
}
