"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { corporateClient, type ManagedAccount } from "@/lib/corporate";
import SignIn from "./SignIn";
import People from "./People";
import JoinLink from "./JoinLink";
import Statements from "./Statements";
import Statement from "./Statement";
import Welcome from "./Welcome";

type Tab = "people" | "join" | "statements";

/* initialStatement: opened from the statement email's link
   (corporate.vellon.ca/statements/<id>), shown once the manager is signed in. */
export default function Portal({ initialStatement = null }: { initialStatement?: string | null }) {
  const supabase = corporateClient();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  // Tagged with the user they were loaded for, so a different sign-in never
  // shows the previous person's accounts while its own load is in flight.
  const [loaded, setLoaded] = useState<{ userId: string; list: ManagedAccount[] } | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>(initialStatement ? "statements" : "people");
  const [statementId, setStatementId] = useState<string | null>(initialStatement);
  const [loadError, setLoadError] = useState<string | null>(null);
  // The manager's name, tagged with the user it was read for (as `loaded`).
  // undefined: not read yet; null: never given, so the first visit asks.
  const [me, setMe] = useState<{ userId: string; name: string | null } | null>(null);
  const [editingName, setEditingName] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    // Only state here: calling supabase from inside this callback deadlocks
    // the client (onauthstatechange-callback-deadlock).
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const userId = session?.user.id ?? null;
  useEffect(() => {
    if (!supabase || !userId) return;
    let alive = true;
    supabase.rpc("ba_my_managed_accounts").then(({ data, error }) => {
      if (!alive) return;
      if (error) {
        setLoadError("We couldn't load your accounts. Refresh to try again.");
        return;
      }
      setLoadError(null);
      setLoaded({ userId, list: (data ?? []) as ManagedAccount[] });
    });
    supabase.rpc("ba_my_manager_name").then(({ data, error }) => {
      // Unreadable: carry on without asking, rather than block the portal.
      if (alive) setMe({ userId, name: error ? "" : ((data as string | null) ?? null) });
    });
    return () => {
      alive = false;
    };
  }, [supabase, userId]);
  const accounts = loaded && loaded.userId === userId ? loaded.list : null;
  const myName = me && me.userId === userId ? me.name : undefined;

  if (!supabase) {
    return (
      <div className="cp-auth">
        <div className="cp-auth-card">
          <div className="cp-auth-brand">Business accounts</div>
          <h1>Not available yet</h1>
          <p>The business account portal isn&apos;t open yet.</p>
        </div>
      </div>
    );
  }
  if (session === undefined) return null;
  if (!session) return <SignIn supabase={supabase} />;

  // signOut defaults to GLOBAL scope, which would end the person's other
  // sessions too (signout-scope bug); this device only.
  const signOut = () => supabase.auth.signOut({ scope: "local" });
  const email = session.user.email ?? "";

  if (loadError || accounts === null || accounts.length === 0) {
    return (
      <div className="cp-auth">
        <div className="cp-auth-card">
          <div className="cp-auth-brand">Business accounts</div>
          {loadError ? (
            <p>{loadError}</p>
          ) : accounts === null ? (
            <p>Loading…</p>
          ) : (
            <>
              <h1>No account to manage</h1>
              <p>{email} isn&apos;t a manager of any business account right now. If you think it should be, ask the taxi company.</p>
            </>
          )}
          <button className="cp-btn" onClick={signOut}>Sign out</button>
        </div>
      </div>
    );
  }

  if (myName === undefined) return null;
  if (myName === null || editingName) {
    return (
      <Welcome
        supabase={supabase}
        current={myName}
        onSaved={(name) => { setMe({ userId: userId!, name }); setEditingName(false); }}
        onCancel={myName ? () => setEditingName(false) : undefined}
      />
    );
  }

  const account = accounts.find((a) => a.account_id === accountId) ?? accounts[0];

  return (
    <>
      <header className="cp-top">
        {accounts.length > 1 ? (
          <select
            className="cp-acct"
            value={account.account_id}
            onChange={(e) => { setAccountId(e.target.value); setStatementId(null); }}
            aria-label="Account"
          >
            {accounts.map((a) => (
              <option key={a.account_id} value={a.account_id}>{a.account_name}</option>
            ))}
          </select>
        ) : (
          <span className="cp-acct-static">{account.account_name}</span>
        )}
        <nav className="cp-nav">
          <button className={tab === "people" ? "on" : ""} onClick={() => setTab("people")}>People</button>
          <button className={tab === "join" ? "on" : ""} onClick={() => setTab("join")}>Join link</button>
          <button disabled title="Coming soon">Rides</button>
          <button className={tab === "statements" ? "on" : ""} onClick={() => { setTab("statements"); setStatementId(null); }}>Statements</button>
        </nav>
        <div className="cp-me">
          <button className="cp-link cp-link-muted" onClick={() => setEditingName(true)} title="Change your name">
            {myName ? `${myName} · ${email}` : email}
          </button>
          <button className="cp-link cp-link-muted" onClick={signOut}>Sign out</button>
        </div>
      </header>
      {tab === "people" ? (
        <People key={account.account_id} supabase={supabase} account={account} />
      ) : tab === "join" ? (
        <JoinLink key={account.account_id} supabase={supabase} account={account} />
      ) : statementId ? (
        <Statement
          key={statementId}
          supabase={supabase}
          id={statementId}
          onBack={() => setStatementId(null)}
          onAccount={(id) => { if (accounts.some((a) => a.account_id === id)) setAccountId(id); }}
        />
      ) : (
        <Statements key={account.account_id} supabase={supabase} account={account} onOpen={setStatementId} />
      )}
    </>
  );
}
