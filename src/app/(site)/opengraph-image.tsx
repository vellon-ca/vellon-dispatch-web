import { ImageResponse } from "next/og";

/* The card shown when a dispatch.vellon.ca link is pasted into email,
   LinkedIn, Slack or a text. Applies to every page of the product site;
   go.vellon.ca is outside this folder and unaffected. */
export const alt = "Vellon Dispatch — run the whole fleet from one screen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px 80px",
          color: "#0b0b0c",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#0b0b0c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
              <path d="M17 18 L31 43 L45 18" stroke="#fff" strokeWidth="6" strokeLinecap="square" />
              <rect x="46" y="40" width="7" height="7" fill="#fff" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>
            Vellon<span style={{ color: "#55555b", fontWeight: 500, marginLeft: 10 }}>Dispatch</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.035em", maxWidth: 900 }}>
            Run the whole fleet from one screen.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#55555b" }}>
            Taxi dispatch: the board, the passenger app and the driver app.
          </div>
        </div>
        <div style={{ display: "flex", height: 10, width: 160, borderRadius: 5, background: "#2450e6" }} />
      </div>
    ),
    { ...size },
  );
}
