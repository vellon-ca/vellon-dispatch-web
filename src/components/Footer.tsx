import { DASHBOARD_URL, PRIVACY_URL, TERMS_URL, VELLON_URL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative border-t border-rule bg-bg">
      <div className="mx-auto max-w-[86rem] px-6 md:px-10">
        <div className="relative overflow-hidden pt-10">
          <p
            aria-hidden
            className="display select-none text-[clamp(4rem,18vw,15rem)] leading-[0.82] text-fg/[0.055]"
            style={{ letterSpacing: "-0.045em" }}
          >
            Dispatch
          </p>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-rule py-6 text-xs text-fg-3 sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <a href={VELLON_URL} className="link-draw transition-colors hover:text-fg">
              Vellon
            </a>
            . Vellon Dispatch is a Vellon product.
          </p>
          <p className="flex flex-wrap items-center gap-4">
            <a href={DASHBOARD_URL} className="link-draw transition-colors hover:text-fg">
              Sign in
            </a>
            <span aria-hidden className="h-3 w-px bg-rule" />
            <a href={PRIVACY_URL} className="link-draw transition-colors hover:text-fg">
              Privacy
            </a>
            <span aria-hidden className="h-3 w-px bg-rule" />
            <a href={TERMS_URL} className="link-draw transition-colors hover:text-fg">
              Terms
            </a>
            <span aria-hidden className="h-3 w-px bg-rule" />
            <a
              href="mailto:hello@vellon.ca"
              className="link-draw transition-colors hover:text-fg"
            >
              hello@vellon.ca
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
