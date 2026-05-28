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
    <div className="group min-w-[140px] flex-1 rounded-2xl border border-white/[0.09] bg-[rgba(15,23,42,0.48)] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md transition hover:border-teal-400/28 hover:bg-[rgba(15,23,42,0.62)] hover:shadow-[0_0_32px_rgba(45,212,191,0.08)]">
      <p className="pa-club-sub text-[0.62rem] text-teal-300/85">{label}</p>
      <p className="mt-3 font-mono text-2xl font-bold tabular-nums tracking-tight text-teal-100 sm:text-[1.85rem] [text-shadow:0_0_20px_rgba(45,212,191,0.28)]">
        {value}
      </p>
      <p className="mt-1.5 text-[0.8rem] text-slate-500">{hint}</p>
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
        className="border-y border-white/[0.06] bg-gradient-to-b from-slate-900/35 via-transparent to-transparent"
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
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-br from-slate-900/40 via-[rgba(15,23,42,0.35)] to-[rgba(2,6,23,0.92)] p-7 shadow-[0_20px_70px_rgba(0,0,0,0.42)] sm:p-9">
          <div className="pointer-events-none absolute -right-20 top-0 h-52 w-52 rounded-full bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.14),transparent_68%)]" />
          <div className="pointer-events-none absolute -left-12 bottom-0 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.1),transparent_72%)]" />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)] lg:items-center">
            <div>
              <p className="pa-section-eyebrow text-indigo-300/85">Backstage</p>
              <h2 className="pa-headline mt-4 max-w-lg text-[clamp(1.75rem,5vw,2.75rem)] text-[var(--text)]">
                Every listing clears the door staff first
              </h2>
              <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-slate-400">
                Submissions sit in <span className="font-bold text-teal-300">pending_review</span> before they hit
                the floor. You certify <span className="font-bold text-rose-400">21+</span> when the venue
                demands it — keep wristbands honest, link your own tickets.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={publishHref}
                  className="inline-flex items-center justify-center rounded-full border border-teal-400/35 bg-teal-400/[0.09] px-6 py-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--text)] no-underline transition hover:bg-teal-400/[0.14]"
                >
                  Run an ad
                </a>
                <a
                  href="#partner"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500 no-underline transition hover:text-fuchsia-400"
                >
                  Partner slots
                </a>
              </div>
            </div>

            <ul className="grid gap-3 text-sm text-slate-400">
              <li className="flex gap-3 rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3.5 backdrop-blur-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-sm font-black text-teal-200">
                  1
                </span>
                <span>
                  <strong className="font-bold text-[var(--text)]">Drop your spec</strong> — time, city, venue, art,
                  visibility.
                </span>
              </li>
              <li className="flex gap-3 rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3.5 backdrop-blur-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fuchsia-400/15 text-sm font-black text-fuchsia-200">
                  2
                </span>
                <span>
                  <strong className="font-bold text-[var(--text)]">Mods at control</strong> — approve, spike, or bounce it
                  back for edits.
                </span>
              </li>
              <li className="flex gap-3 rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3.5 backdrop-blur-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-400/15 text-sm font-black text-indigo-200">
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
