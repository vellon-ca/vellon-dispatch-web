"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  corporateClient,
  type Application,
  type Business,
  type CardView,
  type CompanyPage,
  type ManagedAccount,
  monthlyCardBlock,
} from "@/lib/corporate";
import SignIn from "./SignIn";
import People from "./People";
import JoinLink from "./JoinLink";
import Statements from "./Statements";
import Statement from "./Statement";
import Welcome from "./Welcome";
import Info from "./Info";
import CompanyLanding from "./CompanyLanding";
import ApplyFlow from "./ApplyFlow";
import PlaceAccount from "./PlaceAccount";
import Waiting from "./Waiting";
import Managers from "./Managers";
import Card from "./Card";

type Tab = "people" | "join" | "statements" | "managers" | "card";

type Unplaced = { account_id: string; account_name: string; company_name: string };

// Everything the signed-in portal needs, tagged with the user it was loaded
// for, so a different sign-in never shows the previous person's data while its
// own load is in flight.
type Loaded = {
  userId: string;
  accounts: ManagedAccount[];
  name: string | null;
  unplaced: Unplaced[];
  businesses: Business[];
  applications: Application[];
};

/* initialStatement: opened from the statement email's link
   (corporate.vellon.ca/statements/<id>), shown once the manager is signed in.
   applySlug: corporate.vellon.ca/<slug>, a taxi company's application link
   (mgcj-app .claude/notes/business-portal-design.md). */
export default function Portal({
  initialStatement = null,
  applySlug = null,
}: {
  initialStatement?: string | null;
  applySlug?: string | null;
}) {
  const supabase = corporateClient();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [version, setVersion] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  // The decline email's link, /?account=<id>&tab=card (read once).
  const [cardLink] = useState(readCardLink);
  const [selected, setSelected] = useState<string | null>(cardLink?.account ? `acct:${cardLink.account}` : null); // "acct:<id>" | "apps"
  const [tab, setTab] = useState<Tab>(initialStatement ? "statements" : cardLink?.card ? "card" : "people");
  const [statementId, setStatementId] = useState<string | null>(initialStatement);
  const [editingName, setEditingName] = useState(false);
  const [showSignIn, setShowSignIn] = useState(!!initialStatement || !!cardLink);
  // undefined: still reading; null: no such company (a plain "not found").
  const [company, setCompany] = useState<CompanyPage | null | undefined>(applySlug ? undefined : null);
  const [applying, setApplying] = useState(!!applySlug);
  // The selected account's card (2b), tagged with the account it was read for.
  const [card, setCard] = useState<{ accountId: string; view: CardView } | null>(null);
  const [cardVersion, setCardVersion] = useState(0);

  // Once read, the link's query string goes; the path stays (on a Preview the
  // portal is /corporate).
  useEffect(() => {
    if (cardLink) window.history.replaceState(null, "", window.location.pathname);
  }, [cardLink]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    // Only state here: calling supabase from inside this callback deadlocks
    // the client (onauthstatechange-callback-deadlock).
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !applySlug) return;
    supabase.rpc("ba_company_application_page", { p_slug: applySlug }).then(({ data }) => {
      setCompany((data as CompanyPage | null) ?? null);
    });
  }, [supabase, applySlug]);

  const userId = session?.user.id ?? null;
  useEffect(() => {
    if (!supabase || !userId) return;
    let alive = true;
    Promise.all([
      supabase.rpc("ba_my_managed_accounts"),
      supabase.rpc("ba_my_manager_name"),
      supabase.rpc("ba_unplaced_accounts"),
      supabase.rpc("ba_my_businesses"),
      supabase.rpc("ba_my_applications"),
    ]).then(([acc, nm, un, biz, apps]) => {
      if (!alive) return;
      if (acc.error || un.error || biz.error || apps.error) {
        setLoadError("We couldn't load your accounts. Refresh to try again.");
        return;
      }
      setLoadError(null);
      setLoaded({
        userId,
        accounts: (acc.data ?? []) as ManagedAccount[],
        // Unreadable: carry on without asking, rather than block the portal.
        name: nm.error ? "" : ((nm.data as string | null) ?? null),
        unplaced: (un.data ?? []) as Unplaced[],
        businesses: (biz.data ?? []) as Business[],
        applications: (apps.data ?? []) as Application[],
      });
    });
    return () => {
      alive = false;
    };
  }, [supabase, userId, version]);
  const data = loaded && loaded.userId === userId ? loaded : null;
  const reload = () => setVersion((v) => v + 1);

  // Which account is shown (an account this person does not manage falls back
  // to the first), and its card.
  const shownAccountId = data && selected !== "apps"
    ? (data.accounts.find((a) => `acct:${a.account_id}` === selected) ?? data.accounts[0])?.account_id ?? null
    : null;
  useEffect(() => {
    if (!supabase || !shownAccountId) return;
    let alive = true;
    supabase.rpc("ba_card_view", { p_account: shownAccountId }).then(({ data: v, error }) => {
      if (!alive || error || !v?.ok) return;
      setCard({ accountId: shownAccountId, view: v as CardView });
    });
    return () => {
      alive = false;
    };
  }, [supabase, shownAccountId, cardVersion]);

  // Leave the company link for the portal itself once applying is over: drop
  // the slug from the path rather than going to "/", which on a Preview (where
  // the portal lives at /corporate) is the product site.
  function endApplying() {
    setApplying(false);
    if (applySlug) {
      const path = window.location.pathname.replace(/\/[^/]+\/?$/, "");
      window.history.replaceState(null, "", path || "/");
    }
    setSelected(null);
    reload();
  }

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
  if (session === undefined || company === undefined) return null;

  if (!session) {
    if (applySlug && applying && !showSignIn) {
      if (!company) return <NotFound />;
      return <CompanyLanding supabase={supabase} company={company} onSignIn={() => setShowSignIn(true)} />;
    }
    if (!showSignIn) return <Info onSignIn={() => setShowSignIn(true)} />;
    return <SignIn supabase={supabase} />;
  }

  // signOut defaults to GLOBAL scope, which would end the person's other
  // sessions too (signout-scope bug); this device only.
  const signOut = () => supabase.auth.signOut({ scope: "local" });
  const email = session.user.email ?? "";

  if (loadError || !data) {
    return (
      <div className="cp-auth">
        <div className="cp-auth-card">
          <div className="cp-auth-brand">Business accounts</div>
          <p>{loadError ?? "Loading…"}</p>
          <button className="cp-btn" onClick={signOut}>Sign out</button>
        </div>
      </div>
    );
  }

  if (data.name === null || editingName) {
    return (
      <Welcome
        supabase={supabase}
        current={data.name}
        onSaved={(name) => { setLoaded({ ...data, name }); setEditingName(false); }}
        onCancel={data.name ? () => setEditingName(false) : undefined}
      />
    );
  }

  if (applySlug && applying && company) {
    return (
      <ApplyFlow
        supabase={supabase}
        company={company}
        businesses={data.businesses}
        onDone={endApplying}
        onCancel={endApplying}
      />
    );
  }
  if (applySlug && applying && !company) return <NotFound />;

  if (data.unplaced.length > 0) {
    return (
      <PlaceAccount
        key={data.unplaced[0].account_id}
        supabase={supabase}
        account={data.unplaced[0]}
        businesses={data.businesses}
        onDone={reload}
      />
    );
  }

  const pending = data.applications.filter((a) => a.status === "pending");
  const waitingShown = data.applications.some((a) => a.status === "pending" || a.status === "declined");

  if (data.accounts.length === 0) {
    if (waitingShown) {
      return (
        <>
          <TopBar name={data.name} email={email} onName={() => setEditingName(true)} onSignOut={signOut}>
            <span className="cp-acct-static">{data.businesses[0]?.name ?? "Business accounts"}</span>
          </TopBar>
          <Waiting supabase={supabase} applications={data.applications} onChanged={reload} />
        </>
      );
    }
    return (
      <div className="cp-auth">
        <div className="cp-auth-card">
          <div className="cp-auth-brand">Business accounts</div>
          <h1>No account to manage</h1>
          <p>{email}{" "}isn&apos;t a manager of any business account right now. If you think it should be, ask the taxi company.</p>
          <button className="cp-btn" onClick={signOut}>Sign out</button>
        </div>
      </div>
    );
  }

  const accounts = data.accounts;
  const account = accounts.find((a) => `acct:${a.account_id}` === selected) ?? accounts[0];
  const showingApps = selected === "apps";

  // The menu: accounts grouped by organisation, each with its taxi company;
  // waiting applications at the end of their organisation's group.
  const groups = new Map<string, { label: string; items: { value: string; label: string }[] }>();
  for (const a of accounts) {
    const key = a.business_id ?? `acct:${a.account_id}`;
    const g = groups.get(key) ?? { label: a.business_name ?? a.account_name, items: [] };
    g.items.push({ value: `acct:${a.account_id}`, label: a.business_name && a.account_name === a.business_name
        ? a.company_name
        : `${a.account_name} · ${a.company_name}` });
    groups.set(key, g);
  }
  for (const p of pending) {
    const g = groups.get(p.business_id) ?? { label: p.business_name, items: [] };
    g.items.push({ value: "apps", label: `${p.company_name} · waiting for approval` });
    groups.set(p.business_id, g);
  }
  const options = [...groups.values()];
  const single = options.length === 1 && options[0].items.length === 1;
  const cardView = card && card.accountId === account.account_id ? card.view : null;
  const cardMode = cardView?.billing_mode === "card" || cardView?.billing_mode === "card_monthly";
  // Monthly card: a dead or expired card, or a soft decline with a statement waiting.
  const monthlyBlock = cardView?.billing_mode === "card_monthly" ? monthlyCardBlock(cardView) : null;
  const cardDeclined = cardView?.billing_mode === "card_monthly"
    ? !!monthlyBlock && monthlyBlock !== "no_card"
    : !!cardView?.reason;
  const cardDot = !cardMode ? null
    : cardView?.reason === "no_card" ? "var(--amber)"
    : cardDeclined ? "var(--red)" : null;
  const effectiveTab: Tab =
    tab === "managers" && !account.business_id ? "people"
    : tab === "card" && !cardMode ? (cardView ? "people" : "card")
    : tab;

  return (
    <>
      <TopBar name={data.name} email={email} onName={() => setEditingName(true)} onSignOut={signOut}>
        {single ? (
          <span className="cp-acct-static">{account.account_name} · {account.company_name}</span>
        ) : (
          <select
            className="cp-acct"
            value={showingApps ? "apps" : `acct:${account.account_id}`}
            onChange={(e) => { setSelected(e.target.value); setStatementId(null); }}
            aria-label="Account"
          >
            {options.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.items.map((i) => <option key={i.value + i.label} value={i.value}>{i.label}</option>)}
              </optgroup>
            ))}
          </select>
        )}
        {!showingApps && (
          <nav className="cp-nav">
            <button className={effectiveTab === "people" ? "on" : ""} onClick={() => setTab("people")}>People</button>
            <button className={effectiveTab === "join" ? "on" : ""} onClick={() => setTab("join")}>Join link</button>
            <button disabled title="Coming soon">Rides</button>
            <button className={effectiveTab === "statements" ? "on" : ""} onClick={() => { setTab("statements"); setStatementId(null); }}>Statements</button>
            {account.business_id && (
              <button className={effectiveTab === "managers" ? "on" : ""} onClick={() => setTab("managers")}>Managers</button>
            )}
            {cardMode && (
              <button className={effectiveTab === "card" ? "on" : ""} onClick={() => setTab("card")}>
                {cardDot && <span className="cp-nav-dot" style={{ background: cardDot }} aria-hidden="true" />}
                Card
                {cardDot && <span className="cp-sr">{cardView?.reason === "no_card" ? " (no card yet)" : " (declined)"}</span>}
              </button>
            )}
          </nav>
        )}
      </TopBar>
      {!showingApps && cardMode && cardView?.reason === "no_card" && effectiveTab !== "card" && (
        <div className="cp-card-missing-wrap">
          <div className="cp-banner cp-card-missing" style={{ marginBottom: 0 }}>
            <span className="cp-dot" style={{ background: "var(--amber)" }} />
            <span className="cp-card-missing-text">
              <b>Add a card so your people can book</b>
              <span className="cp-hint">
                {account.company_name}{" "}bills this account to a card, {cardView?.billing_mode === "card_monthly" ? "one charge per monthly statement" : "one charge per ride"}. Until a manager adds one, rides
                can&apos;t be booked on the account.
              </span>
            </span>
            <button className="cp-btn cp-btn-primary" onClick={() => setTab("card")}>Add a card</button>
          </div>
        </div>
      )}
      {showingApps ? (
        <Waiting supabase={supabase} applications={data.applications} onChanged={reload} />
      ) : effectiveTab === "people" ? (
        <People key={account.account_id} supabase={supabase} account={account} />
      ) : effectiveTab === "join" ? (
        <JoinLink key={account.account_id} supabase={supabase} account={account} />
      ) : effectiveTab === "card" ? (
        cardView ? (
          <Card
            key={account.account_id}
            supabase={supabase}
            account={account}
            view={cardView}
            onChanged={() => setCardVersion((v) => v + 1)}
          />
        ) : (
          <main className="cp-main cp-narrow"><div className="cp-empty">Loading…</div></main>
        )
      ) : effectiveTab === "managers" && account.business_id ? (
        <Managers key={account.business_id} supabase={supabase} businessId={account.business_id} businessName={account.business_name ?? ""} />
      ) : statementId ? (
        <Statement
          key={statementId}
          supabase={supabase}
          id={statementId}
          onBack={() => setStatementId(null)}
          onAccount={(id) => { if (accounts.some((a) => a.account_id === id)) setSelected(`acct:${id}`); }}
        />
      ) : (
        <Statements key={account.account_id} supabase={supabase} account={account} onOpen={setStatementId} />
      )}
    </>
  );
}

// /?account=<id>&tab=card, from the decline email. An account this person
// does not manage simply falls back to their first. Null on the server and
// with no such query.
function readCardLink(): { account: string | null; card: boolean } | null {
  if (typeof window === "undefined") return null;
  const q = new URLSearchParams(window.location.search);
  const account = q.get("account");
  const card = q.get("tab") === "card";
  if (!account && !card) return null;
  return { account: account && /^[0-9a-f-]{36}$/i.test(account) ? account : null, card };
}

function TopBar({
  name,
  email,
  onName,
  onSignOut,
  children,
}: {
  name: string;
  email: string;
  onName: () => void;
  onSignOut: () => void;
  children: React.ReactNode;
}) {
  return (
    <header className="cp-top">
      {children}
      <div className="cp-me">
        <button className="cp-link cp-link-muted" onClick={onName} title="Change your name">
          {name ? `${name} · ${email}` : email}
        </button>
        <button className="cp-link cp-link-muted" onClick={onSignOut}>Sign out</button>
      </div>
    </header>
  );
}

function NotFound() {
  return (
    <div className="cp-auth">
      <div className="cp-auth-card">
        <div className="cp-auth-brand">Business accounts</div>
        <h1>Page not found</h1>
        <p>Check the link the taxi company gave you.</p>
      </div>
    </div>
  );
}
