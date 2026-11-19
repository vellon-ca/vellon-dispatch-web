"use client";

import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { money, monthName, RIDE_STATE, ridesCsv, zonedDate, type AccountRide, type ManagedAccount } from "@/lib/corporate";

/* The account's rides, read-only (Victor, 2026-11-19): every upcoming ride,
   then one month's past ones. No driver or car; the ride reference is what a
   manager quotes to the taxi company. Cancelling stays with the rider or
   dispatch. */
export default function Rides({ supabase, account }: { supabase: SupabaseClient; account: ManagedAccount }) {
  const [month, setMonth] = useState<string | null>(null);
  const [data, setData] = useState<{ time_zone: string; month: string; rides: AccountRide[] } | null>(null);
  const [thisMonth, setThisMonth] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [team, setTeam] = useState("");
  const [rider, setRider] = useState("");

  useEffect(() => {
    let alive = true;
    supabase.rpc("ba_account_rides", { p_account: account.account_id, p_month: month }).then(({ data: d, error: e }) => {
      if (!alive) return;
      if (e || !d?.ok) {
        setError("We couldn't load the rides. Refresh to try again.");
        return;
      }
      setError(null);
      setData(d);
      setThisMonth((m) => m ?? d.month);
    });
    return () => {
      alive = false;
    };
  }, [supabase, account.account_id, month]);

  // The last 12 months, newest first, counted back from the company's month.
  const months = useMemo(() => {
    if (!thisMonth) return [];
    const [y, m] = thisMonth.split("-").map(Number);
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(Date.UTC(y, m - 1 - i, 1));
      return d.toISOString().slice(0, 10);
    });
  }, [thisMonth]);

  const all = useMemo(() => data?.rides ?? [], [data]);
  const teams = useMemo(() => [...new Set(all.map((r) => r.team).filter((t): t is string => !!t))].sort(), [all]);
  const riders = useMemo(() => [...new Set(all.map((r) => r.rider ?? "Former member"))].sort(), [all]);
  const shown = all.filter((r) => (!team || r.team === team) && (!rider || (r.rider ?? "Former member") === rider));
  // Upcoming soonest first; past newest first.
  const upcoming = shown.filter((r) => r.state === "booked" || r.state === "in_progress").reverse();
  const past = shown.filter((r) => r.state === "done" || r.state === "cancelled");
  const tz = data?.time_zone ?? "UTC";
  const pastTotal = past.reduce((n, r) => n + (r.total_cents ?? 0), 0);

  function downloadCsv() {
    if (!data) return;
    const url = URL.createObjectURL(new Blob([ridesCsv([...upcoming, ...past], tz)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `rides-${data.month.slice(0, 7)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const table = (rows: AccountRide[], empty: string) =>
    rows.length === 0 ? (
      <div className="cp-empty">{empty}</div>
    ) : (
      <div className="cp-table-wrap">
        <table className="cp-table">
          <thead>
            <tr>
              <th>Pickup</th><th>Rider</th><th>Team</th><th>From</th><th>To</th>
              <th>Status</th><th className="cp-num">Total</th><th>Ride</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={r.state === "cancelled" ? "cp-void" : undefined}>
                <td className="cp-nowrap">{zonedDate(r.pickup_at, tz, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</td>
                <td className="cp-who">{r.rider ?? "Former member"}</td>
                <td className="cp-muted">{r.team ?? "—"}</td>
                <td>{r.from ?? "—"}</td>
                <td>{r.to ?? "—"}</td>
                <td>
                  <span className="cp-status cp-nowrap">
                    <span className="cp-dot" style={{ background: RIDE_STATE[r.state].color }} />
                    {RIDE_STATE[r.state].label}
                  </span>
                </td>
                <td className="cp-num">{r.total_cents == null ? "—" : money(r.total_cents)}</td>
                <td className="cp-muted cp-nowrap">{r.ride_ref ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  return (
    <main className="cp-main">
      <div className="cp-head">
        <div>
          <h1>Rides</h1>
          <p>
            Every ride billed to the account, booked by your people or by {account.company_name}.
            A question about one? Give {account.company_name}{" "}its ride number.
          </p>
        </div>
        <div className="cp-docbar" style={{ marginBottom: 0 }}>
          {teams.length > 0 && (
            <select className="cp-select cp-select-sm" aria-label="Team" value={team} onChange={(e) => setTeam(e.target.value)}>
              <option value="">All teams</option>
              {teams.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
          <select className="cp-select cp-select-sm" aria-label="Rider" value={rider} onChange={(e) => setRider(e.target.value)}>
            <option value="">All riders</option>
            {riders.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <button className="cp-btn" onClick={downloadCsv} disabled={!data}>Download CSV</button>
        </div>
      </div>

      {error && <div className="cp-banner" style={{ color: "var(--red)" }}>{error}</div>}

      <section className="cp-card">
        <div className="cp-card-head">
          <span className="cp-card-title">Upcoming · {upcoming.length}</span>
        </div>
        {data === null && !error ? <div className="cp-empty">Loading…</div> : table(upcoming, "No rides booked.")}
      </section>

      <section className="cp-card">
        <div className="cp-card-head">
          <span className="cp-card-title">Past · {past.length}{past.length > 0 ? ` · ${money(pastTotal)}` : ""}</span>
          {months.length > 0 && (
            <select className="cp-select cp-select-sm" aria-label="Month" value={data?.month ?? ""} onChange={(e) => setMonth(e.target.value)}>
              {months.map((m) => <option key={m} value={m}>{monthName(m)}</option>)}
            </select>
          )}
        </div>
        {data === null && !error ? <div className="cp-empty">Loading…</div> : table(past, "No completed or cancelled rides this month.")}
      </section>
      <div className="cp-foot">Totals include the booking fee. Cancelled rides aren&apos;t billed.</div>
    </main>
  );
}
