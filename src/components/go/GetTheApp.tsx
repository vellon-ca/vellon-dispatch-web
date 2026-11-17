import { StoreButtons } from "./StoreButtons";

/* go.vellon.ca with no company, and the fallback for a company link that does
   not resolve. Never says "company not found": a dev-only demo company, a
   slug not created yet and a typo all land here, and in every case the useful
   answer is the same — install the app and pick the company inside it. */
export function GetTheApp() {
  return (
    <>
      {/* The same header block a company link has, with Vellon in place of
          the company: black like the test company's, name in white. */}
      <div className="flex aspect-[2/1] w-full items-center justify-center bg-black">
        <span className="display px-6 text-center text-[1.6rem] leading-tight text-white">
          Vellon
        </span>
      </div>

      <h1 className="display mt-8 text-[1.9rem] leading-tight">Book your taxi</h1>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-fg-2">
        Get the app, then choose your local taxi company to book a ride, see
        your driver on the map and pay by card or cash.
      </p>
      <div className="mt-10">
        <StoreButtons />
      </div>
    </>
  );
}
