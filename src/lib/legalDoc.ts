import fs from "node:fs";
import path from "node:path";
import { Marked } from "marked";

/**
 * Renders a markdown document from content/legal/ to HTML at BUILD time.
 *
 * The markdown file is the canonical text -- it is what gets reviewed, quoted in
 * a DPA exhibit and pasted to a lawyer -- so the page renders it rather than
 * restating it in JSX. A second hand-maintained copy would drift, and for a legal
 * document the drift is the whole problem: the published page and the reviewed
 * text have to be the same words.
 */

/**
 * GitHub-flavoured heading slugs: lowercase, drop everything that is not a
 * letter, digit, space or hyphen, then spaces to hyphens.
 *
 * This MUST keep matching the in-document links. The privacy policy's table of
 * contents links to #passengers, #drivers, #dispatch-staff,
 * #phone-bookings-guest-passengers, #how-long-we-keep-things,
 * #closing-your-account and #children, and those anchors were written by hand
 * against this rule. marked has emitted no heading ids since v8, so without this
 * every one of those links silently goes nowhere -- a dead link, not an error.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    // Fold accents to their base letter first. Without this the French
    // documents lose every accented letter outright ("réserver" -> "rserver"),
    // which still resolves but is unreadable in a shared link. English headings
    // carry no accents, so their ids are unchanged.
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function buildRenderer() {
  const marked = new Marked({ gfm: true });

  marked.use({
    renderer: {
      // Heading ids, so the document's own contents links resolve.
      heading({ tokens, depth, text }) {
        const id = slugify(text);
        return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
      },

      // Outbound links open in a new tab and cannot reach back into this page
      // through window.opener. The only one today is the Privacy Commissioner.
      link({ href, title, tokens }) {
        const body = this.parser.parseInline(tokens);
        const t = title ? ` title="${title}"` : "";
        return href.startsWith("http")
          ? `<a href="${href}"${t} target="_blank" rel="noopener noreferrer">${body}</a>`
          : `<a href="${href}"${t}>${body}</a>`;
      },
    },
  });

  return marked;
}

export function renderLegalDoc(slug: string): string {
  // Read from the repo root. This runs at BUILD time only -- the page is
  // force-static -- so the file never has to exist in a serverless bundle.
  const file = path.join(process.cwd(), "content", "legal", `${slug}.md`);
  const md = fs.readFileSync(file, "utf8");
  const html = buildRenderer().parse(md) as string;

  // Wrap every table in its own scroll container. Done as a post-pass rather
  // than a renderer override because marked v18 gives an override no handle on
  // the original method, and reaching for it through the prototype is the kind
  // of clever that breaks on a minor bump. The policy's tables carry long
  // sentences (the retention reasons especially), and on a phone an unwrapped
  // table makes the whole PAGE scroll sideways instead of just the table.
  return html.replace(
    /<table>[\s\S]*?<\/table>/g,
    (t) => `<div class="legal-table">${t}</div>`,
  );
}
