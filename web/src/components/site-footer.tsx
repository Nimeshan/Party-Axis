const legacy =
  process.env.NEXT_PUBLIC_LEGACY_SITE_URL?.trim().replace(/\/$/, "") || "";

export function SiteFooter() {
  const terms = legacy ? `${legacy}/terms.html` : "/terms";
  const privacy = legacy ? `${legacy}/privacy.html` : "/privacy";
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-[var(--border)] bg-[linear-gradient(180deg,rgba(6,8,16,0.92),rgba(3,4,10,0.98))]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,245,255,0.6),rgba(255,45,149,0.7),rgba(192,38,255,0.55),transparent)]"
        aria-hidden
      />
      <div className="mx-auto grid w-[var(--pa-content)] gap-10 py-14 pb-[max(3.5rem,env(safe-area-inset-bottom))] md:grid-cols-[1.25fr_auto] md:items-start md:gap-14">
        <div>
          <p className="text-lg font-bold tracking-tight text-[var(--text)]">
            Discover · Singapore <span className="text-[var(--muted)]">&amp; beyond</span>
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
            Party Axis is an independent listing board. Operators are responsible for their own events — we spotlight
            what the community submits. You must be 21+ where required by venue or law.
          </p>
        </div>
        <div className="flex flex-col gap-6 md:items-end">
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold md:justify-end">
            <a
              className="inline-flex min-h-11 items-center text-[var(--text)] no-underline underline-offset-4 transition hover:text-[var(--cyan)] hover:underline md:min-h-0"
              href={terms}
            >
              Terms
            </a>
            <a
              className="inline-flex min-h-11 items-center text-[var(--text)] no-underline underline-offset-4 transition hover:text-[var(--cyan)] hover:underline md:min-h-0"
              href={privacy}
            >
              Privacy
            </a>
            <a
              href={legacy ? `${legacy}/publisher-guidelines.html` : "/publisher-guidelines"}
              className="inline-flex min-h-11 items-center text-[var(--text)] no-underline underline-offset-4 transition hover:text-[var(--cyan)] hover:underline md:min-h-0"
            >
              Publisher guidelines
            </a>
          </nav>
          <p className="text-sm text-[var(--muted)]">© {year} Party Axis</p>
        </div>
      </div>
    </footer>
  );
}
