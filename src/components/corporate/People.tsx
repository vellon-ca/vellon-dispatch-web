"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { formatPhone, type ManagedAccount, type Member, type Team } from "@/lib/corporate";
import AddPeople from "./AddPeople";

type TeamFilter = "all" | "none" | string;
type StatusFilter = "all" | "active" | "invited";

const STATUS: Record<Member["status"], { label: string; color: string }> = {
  active: { label: "Active", color: "var(--green)" },
  invited: { label: "Invited", color: "var(--blue)" },
  requested: { label: "Asked to join", color: "var(--amber)" },
};

function ago(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function People({ supabase, account }: { supabase: SupabaseClient; account: ManagedAccount }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<Member[] | null>(null);
  const [teamFilter, setTeamFilter] = useState<TeamFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newTeam, setNewTeam] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [requestTeam, setRequestTeam] = useState<Record<string, string>>({});

  // Bumped to reload; the fetch sets state only once it resolves.
  const [version, setVersion] = useState(0);
  const load = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let alive = true;
    Promise.all([
      supabase.from("account_teams").select("id, name").eq("account_id", account.account_id).order("name"),
      supabase.rpc("ba_list_members", { p_account: account.account_id }),
    ]).then(([t, m]) => {
      if (!alive) return;
      if (t.error || m.error) {
        setError("We couldn't load your people. Refresh to try again.");
        return;
      }
      setTeams((t.data ?? []) as Team[]);
      setMembers((m.data ?? []) as Member[]);
    });
    return () => {
      alive = false;
    };
  }, [supabase, account.account_id, version]);

  async function act(fn: string, args: Record<string, unknown>, failMsg: string) {
    setError(null);
    const { data, error: e } = await supabase.rpc(fn, args);
    if (e || !data?.ok) {
      setError(data?.reason === "name_taken" ? "There's already a team with that name." : failMsg);
      return false;
    }
    load();
    return true;
  }

  const requests = (members ?? []).filter((m) => m.status === "requested");
  const listed = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (members ?? [])
      .filter((m) => m.status !== "requested")
      .filter((m) => statusFilter === "all" || m.status === statusFilter)
      .filter((m) => teamFilter === "all" || (teamFilter === "none" ? !m.team_id : m.team_id === teamFilter))
      .filter((m) => {
        if (!q) return true;
        return [m.name, m.phone, m.email, m.pending_phone, m.pending_email]
          .filter(Boolean)
          .some((v) => (v as string).toLowerCase().includes(q) || (v as string).replace(/\D/g, "").includes(q.replace(/\D/g, "") || "\u0000"));
      });
  }, [members, search, statusFilter, teamFilter]);

  const counts = useMemo(() => {
    const live = (members ?? []).filter((m) => m.status !== "requested");
    const per: Record<string, number> = {};
    for (const m of live) if (m.team_id) per[m.team_id] = (per[m.team_id] ?? 0) + 1;
    return {
      all: live.length,
      none: live.filter((m) => !m.team_id).length,
      per,
      active: live.filter((m) => m.status === "active").length,
      invited: live.filter((m) => m.status === "invited").length,
    };
  }, [members]);

  async function saveTeam(id: string | null, name: string) {
    if (!name.trim()) return;
    const ok = await act("ba_save_team", { p_account: account.account_id, p_team: id, p_name: name.trim() }, "We couldn't save that team.");
    if (ok) {
      setNewTeam(null);
      setRenaming(null);
    }
  }

  async function deleteTeam(t: Team) {
    if (!window.confirm(`Delete the team "${t.name}"? Its ${counts.per[t.id] ?? 0} people move to No team.`)) return;
    const ok = await act("ba_delete_team", { p_team: t.id }, "We couldn't delete that team.");
    if (ok) setTeamFilter("all");
  }

  async function approve(m: Member) {
    const team = requestTeam[m.id];
    if (team) {
      const { error: e } = await supabase.rpc("ba_update_member", { p_member: m.id, p_team: team });
      if (e) {
        setError("We couldn't set the team.");
        return;
      }
    }
    await act("ba_staff_decide", { p_member: m.id, p_action: "approve" }, "We couldn't approve that request.");
  }

  async function remove(m: Member) {
    const who = m.name || formatPhone(m.pending_phone) || m.pending_email || "this person";
    const q = m.status === "invited"
      ? `Cancel the invite to ${who}?`
      : `Remove ${who} from ${account.account_name}? They can no longer bill rides to the account.`;
    if (!window.confirm(q)) return;
    await act("ba_staff_decide", { p_member: m.id, p_action: "remove" }, "We couldn't remove them.");
  }

  const setTeam = (m: Member, value: string) =>
    act(
      "ba_update_member",
      value ? { p_member: m.id, p_team: value } : { p_member: m.id, p_clear_team: true },
      "We couldn't change the team.",
    );
  const setRole = (m: Member, booker: boolean) =>
    act("ba_update_member", { p_member: m.id, p_role: booker ? "booker" : "rider" }, "We couldn't change that.");

  const selectedTeam = teams.find((t) => t.id === teamFilter);

  return (
    <div className="cp-body">
      <aside className="cp-side">
        <div className="cp-side-title">
          Teams
          <button className="cp-link" onClick={() => setNewTeam("")}>+ New</button>
        </div>
        {newTeam !== null && (
          <form className="cp-team-new" onSubmit={(e) => { e.preventDefault(); saveTeam(null, newTeam); }}>
            <input className="cp-input" autoFocus placeholder="Team name" maxLength={60} value={newTeam} onChange={(e) => setNewTeam(e.target.value)} />
            <button className="cp-btn cp-btn-sm">Add</button>
          </form>
        )}
        <button className={`cp-team ${teamFilter === "all" ? "on" : ""}`} onClick={() => setTeamFilter("all")}>
          <span>Everyone</span><span>{counts.all}</span>
        </button>
        {teams.map((t) =>
          renaming === t.id ? (
            <form key={t.id} className="cp-team-new" onSubmit={(e) => { e.preventDefault(); const v = (e.currentTarget.elements.namedItem("n") as HTMLInputElement).value; saveTeam(t.id, v); }}>
              <input name="n" className="cp-input" autoFocus defaultValue={t.name} maxLength={60} />
              <button className="cp-btn cp-btn-sm">Save</button>
            </form>
          ) : (
            <button key={t.id} className={`cp-team ${teamFilter === t.id ? "on" : ""}`} onClick={() => setTeamFilter(t.id)}>
              <span>{t.name}</span><span>{counts.per[t.id] ?? 0}</span>
            </button>
          ),
        )}
        {selectedTeam && renaming !== selectedTeam.id && (
          <div className="cp-team-tools">
            <button className="cp-link cp-link-muted" onClick={() => setRenaming(selectedTeam.id)}>Rename</button>
            <button className="cp-link cp-btn-danger" onClick={() => deleteTeam(selectedTeam)}>Delete</button>
          </div>
        )}
        <button className={`cp-team ${teamFilter === "none" ? "on" : ""}`} onClick={() => setTeamFilter("none")}>
          <span>No team</span><span>{counts.none}</span>
        </button>
        <div className="cp-side-note">
          Each ride will be stamped with the rider&apos;s team, so your monthly statement splits by team.
        </div>
      </aside>

      <main className="cp-main">
        <div className="cp-head">
          <div>
            <h1>People</h1>
            <p>
              {members === null
                ? "Loading…"
                : `${counts.active} active · ${counts.invited} invited · ${requests.length} asked to join`}
            </p>
          </div>
          <button className="cp-btn cp-btn-primary" onClick={() => setAdding(true)}>Add people</button>
        </div>

        {account.account_status === "suspended" && (
          <div className="cp-banner">
            <span className="cp-dot" style={{ background: "var(--amber)" }} />
            {account.company_name} has paused this account. Nobody can bill rides to it until they turn it back on.
          </div>
        )}
        {error && <div className="cp-banner" style={{ color: "var(--red)" }}>{error}</div>}

        {requests.length > 0 && (
          <section className="cp-card">
            <div className="cp-card-head">
              <span className="cp-card-title">Asked to join · {requests.length}</span>
              <span className="cp-muted" style={{ fontSize: 12 }}>They used your join link</span>
            </div>
            {requests.map((m) => (
              <div key={m.id} className="cp-row">
                <span className="cp-dot" style={{ background: "var(--amber)" }} />
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div className="cp-who">{m.name ?? "Unnamed"}</div>
                  <div className="cp-who-sub">
                    {[formatPhone(m.phone), m.email, ago(m.created_at)].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <select
                  className="cp-select cp-select-sm"
                  aria-label="Team"
                  value={requestTeam[m.id] ?? ""}
                  onChange={(e) => setRequestTeam({ ...requestTeam, [m.id]: e.target.value })}
                >
                  <option value="">No team</option>
                  {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <button className="cp-btn cp-btn-sm" onClick={() => act("ba_staff_decide", { p_member: m.id, p_action: "decline" }, "We couldn't decline that request.")}>Decline</button>
                <button className="cp-btn cp-btn-sm cp-btn-primary" onClick={() => approve(m)}>Approve</button>
              </div>
            ))}
          </section>
        )}

        <section className="cp-card">
          <div className="cp-card-head">
            <div className="cp-filters">
              <input className="cp-input cp-search" placeholder="Name, phone or email" value={search} onChange={(e) => setSearch(e.target.value)} />
              <select className="cp-select cp-select-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} aria-label="Status">
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="invited">Invited</option>
              </select>
            </div>
            <span className="cp-muted" style={{ fontSize: 12 }}>{listed.length} {listed.length === 1 ? "person" : "people"}</span>
          </div>
          {members === null ? (
            <div className="cp-empty">Loading…</div>
          ) : listed.length === 0 ? (
            <div className="cp-empty">
              {counts.all === 0 ? "Nobody yet. Add people by phone or email, or share your join link." : "Nobody matches."}
            </div>
          ) : (
            <div className="cp-table-wrap">
              <table className="cp-table">
                <thead>
                  <tr><th style={{ width: "32%" }}>Person</th><th>Status</th><th>Team</th><th>Books for others</th><th>Joined</th><th /></tr>
                </thead>
                <tbody>
                  {listed.map((m) => (
                    <tr key={m.id}>
                      <td>
                        {m.status === "invited" ? (
                          <>
                            <div className="cp-who cp-muted">{formatPhone(m.pending_phone) || m.pending_email || "Invited"}</div>
                            <div className="cp-who-sub">Invited · their name shows once they accept</div>
                          </>
                        ) : (
                          <>
                            <div className="cp-who">{m.name ?? "Unnamed"}</div>
                            <div className="cp-who-sub">{[formatPhone(m.phone), m.email].filter(Boolean).join(" · ")}</div>
                          </>
                        )}
                      </td>
                      <td>
                        <span className="cp-status"><span className="cp-dot" style={{ background: STATUS[m.status].color }} />{STATUS[m.status].label}</span>
                      </td>
                      <td>
                        <select className="cp-select cp-select-sm" aria-label="Team" value={m.team_id ?? ""} onChange={(e) => setTeam(m, e.target.value)}>
                          <option value="">No team</option>
                          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                      </td>
                      <td>
                        <select className="cp-select cp-select-sm" aria-label="Books for others" value={m.role} onChange={(e) => setRole(m, e.target.value === "booker")}>
                          <option value="rider">No</option>
                          <option value="booker">Yes</option>
                        </select>
                      </td>
                      <td className="cp-muted">
                        {m.status === "invited" ? `Sent ${shortDate(m.created_at)}` : shortDate(m.responded_at ?? m.created_at)}
                      </td>
                      <td>
                        <button className="cp-link cp-link-muted" onClick={() => remove(m)}>
                          {m.status === "invited" ? "Cancel" : "Remove"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <div className="cp-foot">
          {account.company_name}{" "}can see this list and can add people when you ask them to.
        </div>
      </main>

      {adding && (
        <AddPeople
          supabase={supabase}
          account={account}
          teams={teams}
          defaultTeam={teamFilter !== "all" && teamFilter !== "none" ? teamFilter : ""}
          onClose={() => setAdding(false)}
          onDone={load}
        />
      )}
    </div>
  );
}
