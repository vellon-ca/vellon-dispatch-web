/* corporate.vellon.ca for someone signed out: what a business account is, and
   how to get one (ask the taxi company for its link). No sign-up here: a
   business applies only through a taxi company's own link
   (mgcj-app .claude/notes/business-portal-design.md). */
export default function Info({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="cp-pub">
      <header className="cp-pub-top">
        <div className="cp-pub-logo">Vellon <span>· Business accounts</span></div>
        <button className="cp-btn cp-btn-primary" onClick={onSignIn}>Sign in</button>
      </header>
      <main className="cp-pub-main">
        <h1>Taxi rides your organisation pays for, without the receipts.</h1>
        <p className="cp-pub-lead">
          With a business account, your people ride with a local taxi company on Vellon and the ride is billed to
          your organisation. You get one statement a month, split by team.
        </p>
        <div className="cp-pub-cols">
          <section className="cp-pub-card">
            <div className="cp-pub-kicker">Your people</div>
            <h2>Add who can ride</h2>
            <p>Add staff by phone or email, approve those who ask to join, and sort them into teams.</p>
          </section>
          <section className="cp-pub-card">
            <div className="cp-pub-kicker">Your limits</div>
            <h2>Spend stays in check</h2>
            <p>Set a limit per ride and per month, within what the taxi company allows.</p>
          </section>
          <section className="cp-pub-card">
            <div className="cp-pub-kicker">Your statements</div>
            <h2>One bill a month</h2>
            <p>Every ride, by team, as a statement you can download, print and pay the taxi company for.</p>
          </section>
        </div>
        <div className="cp-pub-how">
          <p>
            <b>How do I get one?</b> Ask your taxi company for their business account link. If they use Vellon, you
            can apply there in a few minutes, and they set it up.
          </p>
          <button className="cp-btn" onClick={onSignIn}>Already a manager? Sign in</button>
        </div>
      </main>
      <footer className="cp-pub-foot">corporate.vellon.ca · Vellon, the dispatch software your taxi company uses</footer>
    </div>
  );
}
