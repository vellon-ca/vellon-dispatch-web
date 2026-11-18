"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompanyPage } from "@/lib/corporate";
import SignIn from "./SignIn";

/* corporate.vellon.ca/<slug> for someone signed out: the taxi company's own
   application page (mockup "A taxi company's link", approved 2026-11-18). The
   Apply card signs them in through manager-sign-in's application path; what
   follows (name, organisation, application) happens once they are in. */
export default function CompanyLanding({
  supabase,
  company,
  onSignIn,
}: {
  supabase: SupabaseClient;
  company: CompanyPage;
  onSignIn: () => void;
}) {
  return (
    <div className="cp-pub">
      <header className="cp-pub-top">
        <div className="cp-pub-logo">{company.name} <span>· Business accounts</span></div>
        <button className="cp-btn" onClick={onSignIn}>Sign in</button>
      </header>
      <main className="cp-pub-main">
        <div className="cp-pub-split">
          <div>
            <h1>A business account with {company.name}</h1>
            <p className="cp-pub-lead">
              Your staff ride with {company.name} and the rides are billed to your organisation, with one statement a
              month. Apply here; {company.name} reviews it and sets up the account with you.
            </p>
            <ol className="cp-pub-steps">
              <li>Confirm your work email with a code</li>
              <li>Tell us about your organisation</li>
              <li>{company.name} approves it, and you get an email</li>
              <li>Add your people from the business portal</li>
            </ol>
          </div>
          {company.open ? (
            <div className="cp-auth-card">
              <SignIn
                supabase={supabase}
                apply={company.slug}
                bare
                intro="Already have a business account with another taxi company on Vellon? Use the same email; you'll pick your organisation next."
              />
            </div>
          ) : (
            <div className="cp-pub-closed">
              {company.name} isn&apos;t taking applications online.
              {company.phone ? ` Contact them at ${company.phone}.` : " Contact them directly."}
            </div>
          )}
        </div>
      </main>
      <footer className="cp-pub-foot">corporate.vellon.ca · Vellon, the dispatch software {company.name} uses</footer>
    </div>
  );
}
