type HomeHeroProps = {
  publishHref: string;
};

export function HomeHero({ publishHref }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden pb-24 pt-12 sm:pt-16 md:pb-32">
      {/* Haze & strobes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[25%] top-[-40%] h-[min(620px,110vw)] w-[min(620px,110vw)] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.14),transparent_65%)] blur-3xl motion-safe:opacity-90" />
        <div className="absolute -right-[5%] top-[0%] h-[min(520px,95vw)] w-[min(560px,100vw)] rounded-full bg-[radial-gradient(circle_at_center,rgba(192,38,255,0.18),transparent_62%)] blur-3xl" />
        <div className="absolute bottom-[-45%] left-[20%] h-[min(520px,90vw)] w-[min(520px,90vw)] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,45,149,0.14),transparent_68%)] blur-3xl" />
        <div className="absolute right-[5%] top-[40%] h-px w-[min(240px,40vw)] rotate-[12deg] bg-gradient-to-r from-transparent via-[var(--cyan)] to-transparent opacity-70" />
        <div className="absolute left-[8%] bottom-[32%] h-px w-[min(180px,35vw)] -rotate-[8deg] bg-gradient-to-r from-transparent via-[var(--accent-magenta)] to-transparent opacity-60" />
      </div>

      <div className="relative mx-auto w-[var(--pa-content)]">
        <div className="grid items-start gap-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)] lg:gap-12">
          <div className="pa-fade-up">
            <div className="inline-flex items-center gap-3 border-l-4 border-[var(--accent-hot)] bg-[rgba(255,10,108,0.08)] px-4 py-2.5 pr-5 shadow-[0_0_32px_rgba(255,45,149,0.12)]">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--ok)] opacity-50 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-sm bg-[var(--ok)] shadow-[0_0_14px_var(--ok)]" />
              </span>
              <span className="pa-club-sub text-[var(--text)]">
                Singapore · regional nights · <span className="text-[var(--cyan)]">doors open</span>
              </span>
            </div>

            <div className="relative mt-10">
              <p className="pa-headline text-[clamp(2.75rem,10vw,5.75rem)] text-[var(--text)]">
                Where <span className="text-[var(--text-dim)]">night</span>
                <span className="text-[var(--accent-magenta)]">life</span>
              </p>
              <p className="pa-headline mt-1 bg-[image:var(--pa-gradient-text)] bg-clip-text text-[clamp(2.75rem,10vw,5.75rem)] text-transparent">
                finds gravity
              </p>
              <div className="mt-6 h-1 w-full max-w-[12rem] bg-[image:var(--pa-gradient-cta)] shadow-[0_0_20px_var(--pink-glow)]" />
            </div>

            <p className="mt-8 max-w-xl text-pretty text-base font-medium leading-relaxed text-[var(--muted)] sm:text-lg">
              The listings board built like a basement rave: loud discovery, tight moderation, and a lane for promoters
              who keep the night honest.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#browse"
                className="pa-btn-primary inline-flex min-h-12 w-full items-center justify-center rounded-md px-8 py-3.5 text-xs text-[#050108] no-underline sm:w-auto sm:min-h-0 sm:text-sm"
              >
                Enter the floor
              </a>
              <a
                href="#highlights"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-[var(--accent-magenta)]/50 bg-[rgba(255,45,149,0.06)] px-8 py-3.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--text)] no-underline shadow-[0_0_24px_rgba(255,45,149,0.15)] transition hover:border-[var(--cyan)] hover:bg-[rgba(0,245,255,0.08)] hover:shadow-[0_0_28px_rgba(0,245,255,0.2)] sm:w-auto sm:min-h-0 sm:text-sm"
              >
                Spotlight only
              </a>
              <a
                href={publishHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-dashed border-[var(--cyan)]/40 bg-transparent px-8 py-3.5 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--cyan)] no-underline transition hover:border-[var(--accent-magenta)] hover:text-[var(--accent-magenta)] sm:w-auto sm:min-h-0 sm:text-sm"
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
                  className="rounded-[var(--pa-radius-xl)] border border-[var(--border)] bg-[rgba(12,4,20,0.75)] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(0,245,255,0.06)] transition hover:border-[var(--cyan)]/35 hover:shadow-[0_0_24px_rgba(0,245,255,0.08)]"
                >
                  <dt className="pa-club-sub text-[0.65rem] text-[var(--accent-magenta)]">{row.k}</dt>
                  <dd className="mt-2 text-[0.82rem] font-semibold leading-snug text-[var(--text)]">{row.v}</dd>
                </div>
              ))}
            </dl>

            <a
              href="#highlights"
              className="mt-16 inline-flex min-h-11 items-center gap-2 pa-club-sub text-[var(--muted)] no-underline transition hover:text-[var(--cyan)]"
            >
              Drop in
              <span className="motion-safe:inline-block motion-safe:animate-bounce text-lg leading-none text-[var(--accent-magenta)]" aria-hidden>
                ↓
              </span>
            </a>
          </div>

          <aside className="relative overflow-hidden rounded-[var(--pa-radius-2xl)] border border-[var(--accent-magenta)]/35 bg-[linear-gradient(165deg,rgba(40,6,48,0.5),rgba(6,2,14,0.92))] p-6 pa-neon-edge pa-fade-up pa-delay-1 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(0,245,255,0.1),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22120%22%20height=%22120%22%20viewBox=%220%200%20120%20120%22%3E%3Cfilter%20id=%22n%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.85%22%20numOctaves=%222%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22120%22%20height=%22120%22%20filter=%22url(%23n)%22%20opacity=%220.06%22/%3E%3C/svg%3E')] opacity-[0.85]" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="pa-section-eyebrow">On deck</p>
                  <p className="mt-3 pa-headline text-[1.75rem] text-[var(--text)]">
                    Promoter runway
                  </p>
                </div>
                <span className="shrink-0 border border-[var(--ok)]/50 bg-[rgba(57,255,20,0.08)] px-2.5 py-1 pa-club-sub text-[0.65rem] text-[var(--ok)] shadow-[0_0_20px_rgba(57,255,20,0.25)]">
                  Live
                </span>
              </div>
              <ul className="mt-8 space-y-5 text-[0.92rem] text-[var(--muted)]">
                <li className="flex gap-3.5">
                  <span className="mt-1.5 inline-flex h-2 w-2 shrink-0 rounded-sm bg-[var(--cyan)] shadow-[0_0_16px_var(--cyan-glow)]" />
                  <div>
                    <strong className="font-bold text-[var(--text)]">Hard moderation</strong> — approvals, kills, and notes
                    logged for your crew.
                  </div>
                </li>
                <li className="flex gap-3.5">
                  <span className="mt-1.5 inline-flex h-2 w-2 shrink-0 rounded-sm bg-[var(--accent-magenta)] shadow-[0_0_18px_var(--pink-glow)]" />
                  <div>
                    <strong className="font-bold text-[var(--text)]">SG-first pulse</strong> — built for the island, still
                    hungry for cross-border flyers.
                  </div>
                </li>
                <li className="flex gap-3.5">
                  <span className="mt-1.5 inline-flex h-2 w-2 shrink-0 rounded-sm bg-[var(--accent-violet)] shadow-[0_0_14px_var(--purple-glow)]" />
                  <div>
                    <strong className="font-bold text-[var(--text)]">Partner airtime</strong> — brands slot in without
                    trashing the editorial grind.
                  </div>
                </li>
              </ul>
              <div className="mt-8 rounded-[var(--pa-radius-xl)] border border-dashed border-[var(--cyan)]/35 bg-[rgba(0,245,255,0.04)] px-5 py-4 text-[0.88rem] text-[var(--muted)]">
                <span className="font-bold text-[var(--accent-hot)]">21+</span> where the door says so. Own your copy,
                artwork, and booze rules — peep{" "}
                <a href="/terms" className="font-semibold text-[var(--cyan)] underline-offset-2 hover:underline">
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
