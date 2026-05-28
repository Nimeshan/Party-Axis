type HomeHeroProps = {
  publishHref: string;
};

export function HomeHero({ publishHref }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden pb-24 pt-14 sm:pt-20 md:pb-36">
      {/* Light structural accents — mesh + faint beams (hero blobs live on page shell) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.85]">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)`,
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(180deg,black,transparent)",
          }}
        />
        <div className="absolute right-[8%] top-[38%] h-px w-[min(220px,38vw)] rotate-[11deg] bg-gradient-to-r from-transparent via-teal-400/45 to-transparent" />
        <div className="absolute left-[10%] bottom-[28%] h-px w-[min(160px,34vw)] -rotate-[7deg] bg-gradient-to-r from-transparent via-indigo-400/35 to-transparent" />
      </div>

      <div className="relative mx-auto w-[var(--pa-content)]">
        <div className="grid items-start gap-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)] lg:gap-14">
          <div className="pa-fade-up">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.12] bg-[rgba(15,23,42,0.45)] px-4 py-2.5 pr-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/80 opacity-40 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)]" />
              </span>
              <span className="pa-club-sub text-[var(--text-dim)]">
                Singapore · regional nights · <span className="text-teal-300/95">doors open</span>
              </span>
            </div>

            <div className="relative mt-11">
              <p className="pa-headline text-[clamp(2.65rem,9.5vw,5.5rem)] tracking-[0.03em] text-[var(--text)]">
                Where <span className="text-slate-400/95">night</span>
                <span className="text-fuchsia-400/95">life</span>
              </p>
              <p className="pa-headline mt-2 bg-gradient-to-br from-teal-200 via-indigo-200 to-fuchsia-300 bg-clip-text text-[clamp(2.65rem,9.5vw,5.5rem)] tracking-[0.03em] text-transparent">
                finds gravity
              </p>
              <div className="mt-7 h-[3px] w-full max-w-[10rem] rounded-full bg-gradient-to-r from-teal-400/90 via-indigo-400/85 to-fuchsia-400/90 opacity-90 shadow-[0_0_28px_rgba(45,212,191,0.25)]" />
            </div>

            <p className="mt-9 max-w-xl text-pretty text-base font-normal leading-[1.65] text-slate-400 sm:text-[1.0625rem]">
              The listings board built like a basement rave: loud discovery, tight moderation, and a lane for promoters
              who keep the night honest.
            </p>

            <div className="mt-11 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#browse"
                className="pa-btn-primary inline-flex min-h-12 w-full items-center justify-center rounded-full px-8 py-3.5 text-xs text-[#050108] no-underline sm:w-auto sm:min-h-0 sm:text-sm"
              >
                Enter the floor
              </a>
              <a
                href="#highlights"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/14 bg-white/[0.04] px-8 py-3.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--text)] no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition hover:border-teal-400/35 hover:bg-teal-400/[0.07] hover:text-teal-100 sm:w-auto sm:min-h-0 sm:text-sm"
              >
                Spotlight only
              </a>
              <a
                href={publishHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-dashed border-teal-400/35 bg-transparent px-8 py-3.5 text-xs font-extrabold uppercase tracking-[0.12em] text-teal-300/95 no-underline transition hover:border-fuchsia-400/45 hover:text-fuchsia-200 sm:w-auto sm:min-h-0 sm:text-sm"
              >
                Run an ad
              </a>
            </div>

            <dl className="mt-14 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { k: "Bass", v: "Search · cities · weekend lock" },
                { k: "Cut", v: "Human moderation · paper trail" },
                { k: "Hype", v: "Spotlights · partner rails" },
              ].map((row) => (
                <div
                  key={row.k}
                  className="rounded-2xl border border-white/[0.08] bg-[rgba(15,23,42,0.42)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md transition hover:border-teal-400/22 hover:bg-[rgba(15,23,42,0.55)]"
                >
                  <dt className="pa-club-sub text-[0.65rem] text-teal-300/90">{row.k}</dt>
                  <dd className="mt-2 text-[0.82rem] font-semibold leading-snug text-[var(--text)]">{row.v}</dd>
                </div>
              ))}
            </dl>

            <a
              href="#highlights"
              className="mt-16 inline-flex min-h-11 items-center gap-2 pa-club-sub text-slate-500 no-underline transition hover:text-teal-300"
            >
              Drop in
              <span className="motion-safe:inline-block motion-safe:animate-bounce text-lg leading-none text-fuchsia-400/90" aria-hidden>
                ↓
              </span>
            </a>
          </div>

          <aside className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-slate-900/65 via-[rgba(15,23,42,0.55)] to-[rgba(2,6,23,0.92)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] pa-fade-up pa-delay-1 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(45,212,191,0.07),transparent_58%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22120%22%20height=%22120%22%20viewBox=%220%200%20120%20120%22%3E%3Cfilter%20id=%22n%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.85%22%20numOctaves=%222%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22120%22%20height=%22120%22%20filter=%22url(%23n)%22%20opacity=%220.05%22/%3E%3C/svg%3E')] opacity-[0.9]" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="pa-section-eyebrow text-indigo-300/90">On deck</p>
                  <p className="mt-3 pa-headline text-[1.75rem] text-[var(--text)]">
                    Promoter runway
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-400/35 bg-emerald-400/[0.09] px-2.5 py-1 pa-club-sub text-[0.65rem] text-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.18)]">
                  Live
                </span>
              </div>
              <ul className="mt-8 space-y-5 text-[0.92rem] text-slate-400">
                <li className="flex gap-3.5">
                  <span className="mt-1.5 inline-flex h-2 w-2 shrink-0 rounded-full bg-teal-400 shadow-[0_0_14px_rgba(45,212,191,0.45)]" />
                  <div>
                    <strong className="font-bold text-[var(--text)]">Hard moderation</strong> — approvals, kills, and notes
                    logged for your crew.
                  </div>
                </li>
                <li className="flex gap-3.5">
                  <span className="mt-1.5 inline-flex h-2 w-2 shrink-0 rounded-full bg-fuchsia-400 shadow-[0_0_14px_rgba(232,121,249,0.35)]" />
                  <div>
                    <strong className="font-bold text-[var(--text)]">SG-first pulse</strong> — built for the island, still
                    hungry for cross-border flyers.
                  </div>
                </li>
                <li className="flex gap-3.5">
                  <span className="mt-1.5 inline-flex h-2 w-2 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_14px_rgba(129,140,248,0.35)]" />
                  <div>
                    <strong className="font-bold text-[var(--text)]">Partner airtime</strong> — brands slot in without
                    trashing the editorial grind.
                  </div>
                </li>
              </ul>
              <div className="mt-8 rounded-2xl border border-dashed border-teal-400/22 bg-teal-400/[0.04] px-5 py-4 text-[0.88rem] text-slate-400">
                <span className="font-bold text-rose-400">21+</span> where the door says so. Own your copy,
                artwork, and booze rules — peep{" "}
                <a href="/terms" className="font-semibold text-teal-300 underline-offset-2 hover:underline">
                  Terms
                </a>
                .
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
