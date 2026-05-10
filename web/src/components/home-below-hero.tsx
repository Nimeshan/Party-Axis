import type { PartyAxisEvent } from "@/lib/events";

type Props = {
  events: PartyAxisEvent[];
  publishHref: string;
};

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="group min-w-[140px] flex-1 rounded-[var(--pa-radius-xl)] border border-[var(--accent-magenta)]/20 bg-[rgba(10,2,18,0.85)] px-5 py-5 shadow-[inset_0_0_0_1px_rgba(0,245,255,0.05),0_0_32px_rgba(0,0,0,0.5)] transition hover:border-[var(--cyan)]/40 hover:shadow-[0_0_28px_rgba(0,245,255,0.12)]">
      <p className="pa-club-sub text-[0.62rem] text-[var(--accent-magenta)]">{label}</p>
      <p className="mt-3 font-mono text-2xl font-bold tabular-nums tracking-tight text-[var(--cyan)] sm:text-[1.85rem] [text-shadow:0_0_24px_rgba(0,245,255,0.35)]">
        {value}
      </p>
      <p className="mt-1.5 text-[0.8rem] text-[var(--muted)]">{hint}</p>
    </div>
  );
}

export function HomeBelowHero({ events, publishHref }: Props) {
  const highlightCount = events.filter((e) => e.is_highlight).length;
  const cityCount = new Set(events.map((e) => e.city).filter(Boolean)).size;
  const total = events.length;

  return (
    <>
      <section
        aria-label="Live snapshot"
        className="border-y border-[var(--border)] bg-[linear-gradient(180deg,rgba(24,6,32,0.45),rgba(4,2,10,0.75))]"
      >
        <div className="mx-auto flex w-[var(--pa-content)] flex-col gap-4 py-12 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-between sm:gap-5">
          <Stat
            label="On the board"
            value={String(total)}
            hint={total === 0 ? "Wire PARTYAXIS_BACKEND_URL" : "Approved & live"}
          />
          <Stat
            label="Spotlights"
            value={String(highlightCount)}
            hint={highlightCount === 0 ? "Mods tag the big rooms" : "Hand-picked for the rail"}
          />
          <Stat
            label="Cities"
            value={String(cityCount)}
            hint={cityCount <= 1 ? "SG-born, export-ready" : "Cross-town heat"}
          />
        </div>
      </section>

      <div className="mx-auto mt-14 w-[var(--pa-content)] md:mt-20">
        <div className="relative overflow-hidden rounded-[var(--pa-radius-2xl)] border border-[var(--accent-magenta)]/25 bg-[linear-gradient(145deg,rgba(36,8,44,0.45),rgba(6,2,12,0.95))] p-7 pa-neon-edge sm:p-9">
          <div className="pointer-events-none absolute -right-20 top-0 h-52 w-52 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,45,149,0.2),transparent_65%)]" />
          <div className="pointer-events-none absolute -left-12 bottom-0 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.12),transparent_70%)]" />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)] lg:items-center">
            <div>
              <p className="pa-section-eyebrow">Backstage</p>
              <h2 className="pa-headline mt-4 max-w-lg text-[clamp(1.75rem,5vw,2.75rem)] text-[var(--text)]">
                Every listing clears the door staff first
              </h2>
              <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-[var(--muted)]">
                Submissions sit in <span className="font-bold text-[var(--cyan)]">pending_review</span> before they hit
                the floor. You certify <span className="font-bold text-[var(--accent-hot)]">21+</span> when the venue
                demands it — keep wristbands honest, link your own tickets.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={publishHref}
                  className="inline-flex items-center justify-center rounded-md border border-[var(--cyan)]/40 bg-[rgba(0,245,255,0.08)] px-6 py-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--text)] no-underline transition hover:bg-[rgba(0,245,255,0.15)]"
                >
                  Run an ad
                </a>
                <a
                  href="#partner"
                  className="inline-flex items-center justify-center rounded-md px-6 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--muted)] no-underline transition hover:text-[var(--accent-magenta)]"
                >
                  Partner slots
                </a>
              </div>
            </div>

            <ul className="grid gap-3 text-sm text-[var(--muted)]">
              <li className="flex gap-3 rounded-[var(--pa-radius-xl)] border border-[var(--border)] bg-black/40 px-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--cyan)]/15 text-sm font-black text-[var(--cyan)]">
                  1
                </span>
                <span>
                  <strong className="font-bold text-[var(--text)]">Drop your spec</strong> — time, city, venue, art,
                  visibility.
                </span>
              </li>
              <li className="flex gap-3 rounded-[var(--pa-radius-xl)] border border-[var(--border)] bg-black/40 px-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--accent-magenta)]/15 text-sm font-black text-[var(--accent-magenta)]">
                  2
                </span>
                <span>
                  <strong className="font-bold text-[var(--text)]">Mods at control</strong> — approve, spike, or bounce it
                  back for edits.
                </span>
              </li>
              <li className="flex gap-3 rounded-[var(--pa-radius-xl)] border border-[var(--border)] bg-black/40 px-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--accent-violet)]/15 text-sm font-black text-[var(--accent-violet)]">
                  3
                </span>
                <span>
                  <strong className="font-bold text-[var(--text)]">Lights up</strong> — searchable, filterable, spotlight-ready.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
