"use client";

import { useMemo, useState } from "react";
import type { PartyAxisEvent } from "@/lib/events";

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function EventsShell({ events, publishHref = "/publish" }: { events: PartyAxisEvent[]; publishHref?: string }) {
  const highlights = useMemo(() => events.filter((e) => e.is_highlight), [events]);
  const cityOptions = useMemo(() => {
    const set = new Set(events.map((e) => e.city).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [events]);

  const [query, setQuery] = useState("");
  const [highlightsOnly, setHighlightsOnly] = useState(false);
  const [city, setCity] = useState<string | null>(null);
  const [showAllCities, setShowAllCities] = useState(false);
  // Date range filter
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const visibleCities = showAllCities ? cityOptions : cityOptions.slice(0, 10);
  const hasMoreCities = cityOptions.length > 10;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let out = [...events];
    if (highlightsOnly) out = out.filter((e) => e.is_highlight);
    if (city) out = out.filter((e) => e.city === city);
    if (needle) out = out.filter((e) => blob(e).includes(needle));
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      out = out.filter((e) => {
        if (!e.start_at) return false;
        return new Date(e.start_at).getTime() >= from;
      });
    }
    if (dateTo) {
      const to = new Date(dateTo + "T23:59:59").getTime();
      out = out.filter((e) => {
        if (!e.start_at) return false;
        return new Date(e.start_at).getTime() <= to;
      });
    }
    return [...out].sort((a, b) => ts(a.start_at) - ts(b.start_at));
  }, [events, query, highlightsOnly, city, dateFrom, dateTo]);

  const hasActiveFilters = query || highlightsOnly || city || dateFrom || dateTo;

  function resetAll() {
    setQuery("");
    setHighlightsOnly(false);
    setCity(null);
    setDateFrom("");
    setDateTo("");
  }

  return (
    <>
      <section
        id="highlights"
        aria-label="Highlighted events"
        className="relative scroll-mt-36 bg-gradient-to-b from-slate-900/22 via-transparent to-transparent py-14 sm:scroll-mt-40 sm:py-20"
      >
        <div className="mx-auto mb-10 flex w-[var(--pa-content)] flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="pa-section-eyebrow text-[var(--accent-magenta)]">Strobe rail</p>
            <div className="mt-4 flex flex-col gap-2">
              <h2 className="pa-headline text-[clamp(1.85rem,5vw,2.6rem)] text-[var(--text)]">
                Hand-picked highlights
              </h2>
              <p className="max-w-xl text-[0.98rem] leading-relaxed text-[var(--muted)]">
                Standouts float on a dedicated rail — snap-scroll on your phone, full width on desktop.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[var(--cyan-soft)] bg-[rgba(56,189,248,0.06)] px-3.5 py-2 font-mono text-[0.75rem] font-bold uppercase tracking-wide text-[var(--cyan)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              {events.length === 0 ? "Moderation queue warming" : `${highlights.length} featured · ${events.length} total live`}
            </span>
          </div>
        </div>

        {highlights.length === 0 ? (
          <div className="mx-auto mb-16 w-[var(--pa-content)] rounded-3xl border border-dashed border-white/[0.1] bg-[rgba(15,23,42,0.45)] px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl sm:px-10">
            <p className="mx-auto max-w-lg text-[0.98rem] leading-relaxed text-[var(--muted)]">
              <span className="font-semibold text-[var(--text)]">Quiet stage.</span> When moderators tag a highlight it
              lands here instantly. Meanwhile, jump down to Explorer or tee up{" "}
              <a href={publishHref} className="font-semibold text-[var(--cyan)] underline-offset-4 hover:underline">
                Publish an ad
              </a>
              .
            </p>
            <a
              href="#browse"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-white/[0.06] px-6 py-3 text-sm font-bold text-[var(--text)] transition hover:bg-white/[0.1]"
            >
              Go to explorer
            </a>
          </div>
        ) : (
          <div className="relative mx-auto mb-16 w-full max-w-[var(--pa-content)]">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--surface)] to-transparent sm:w-14" aria-hidden />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--surface)] to-transparent sm:w-14" aria-hidden />
            <div className="pa-carousel flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:gap-5 sm:px-[max(1rem,calc((100vw-1180px)/2+1rem))] md:gap-6">
              {highlights.slice(0, 8).map((ev) => (
                <FeaturedCard key={ev.id} event={ev} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section
        id="browse"
        className="scroll-mt-36 border-t border-white/[0.06] bg-gradient-to-b from-[rgba(15,23,42,0.42)] via-[rgba(2,6,23,0.88)] to-[rgba(2,6,23,0.98)] pb-24 pt-14 sm:scroll-mt-40 sm:pb-32 sm:pt-20"
      >
        <div className="mx-auto w-[var(--pa-content)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="pa-headline text-[clamp(1.75rem,5vw,2.35rem)] text-[var(--text)]">Explorer</h2>
              <p className="mt-2 max-w-xl text-[0.98rem] leading-relaxed text-[var(--muted)]">
                Search the floor, chip cities, or filter by date — everything here is already approved.
              </p>
            </div>
            <p className="text-sm font-semibold text-[var(--muted)]">
              Sorted <span className="text-[var(--text)]">soonest first</span>
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="w-full lg:max-w-xl">
              {/* Search */}
              <label className="sr-only" htmlFor="pa-search-events">Search events</label>
              <div className="relative">
                <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="m15.795 14.954.353.353 4.849 4.849-1.06 1.06-4.849-4.849-.353-.353a8 8 0 1 1 1.06-1.06ZM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z" fill="currentColor" />
                </svg>
                <input
                  id="pa-search-events"
                  type="search"
                  placeholder='Try "CBD" · "warehouse" · promoter name…'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[3.35rem] w-full rounded-full border border-[var(--border-strong)] bg-white/[0.05] py-[0.85rem] pl-12 pr-12 text-sm text-[var(--text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none ring-1 ring-white/[0.03] placeholder:text-[var(--muted)] transition focus-visible:border-[var(--cyan)] focus-visible:ring-2 focus-visible:ring-[var(--cyan-soft)]"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 inline-flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full px-2 text-xs font-bold uppercase tracking-wide text-[var(--muted)] transition hover:bg-white/[0.06] hover:text-[var(--text)] sm:right-3 sm:min-h-0 sm:min-w-0 sm:px-3 sm:py-1"
                  >
                    Clear
                  </button>
                ) : null}
              </div>

              {/* Highlight toggle */}
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[0.9rem]">
                <Toggle checked={highlightsOnly} label="Highlighted only" onChange={setHighlightsOnly} />
              </div>

              {/* Date range filter */}
              <div className="mt-6">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Date range</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--muted)]">From</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="rounded-lg border border-[var(--border)] bg-[rgba(5,8,14,0.85)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan-soft)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--muted)]">To</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="rounded-lg border border-[var(--border)] bg-[rgba(5,8,14,0.85)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan-soft)]"
                    />
                  </div>
                </div>
              </div>

              {/* City filter */}
              {cityOptions.length ? (
                <div className="mt-8">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">City focus</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Chip active={city === null} label="All cities" onClick={() => setCity(null)} />
                    {visibleCities.map((c) => (
                      <Chip key={c} active={city === c} label={c} onClick={() => setCity(c === city ? null : c)} />
                    ))}
                    {hasMoreCities && !showAllCities && (
                      <button
                        type="button"
                        onClick={() => setShowAllCities(true)}
                        className="min-h-11 rounded-full border border-dashed border-white/[0.12] px-4 py-2 text-[0.8rem] font-bold text-[var(--muted)] transition hover:border-white/20 hover:text-[var(--text)] sm:min-h-0"
                      >
                        +{cityOptions.length - 10} more
                      </button>
                    )}
                    {hasMoreCities && showAllCities && (
                      <button
                        type="button"
                        onClick={() => setShowAllCities(false)}
                        className="min-h-11 rounded-full border border-dashed border-white/[0.12] px-4 py-2 text-[0.8rem] font-bold text-[var(--muted)] transition hover:border-white/20 hover:text-[var(--text)] sm:min-h-0"
                      >
                        Show less
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Results count with aria-live */}
            <div
              className="flex items-center rounded-[var(--pa-radius-xl)] border border-[var(--border)] bg-white/[0.035] px-5 py-4 text-[0.92rem] text-[var(--muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] lg:max-w-xs"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="font-semibold text-[var(--text)]">{filtered.length}</span>
              &nbsp;{filtered.length === 1 ? "match" : "matches"}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="ml-4 whitespace-nowrap text-xs font-bold uppercase tracking-[0.16em] text-[var(--cyan)] underline-offset-4 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-14 rounded-[var(--pa-radius-2xl)] border border-[var(--border-strong)] bg-[rgba(8,12,22,0.72)] px-8 py-16 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
              <h3 className="text-[1.35rem] font-bold text-[var(--text)]">Nothing in this lane</h3>
              <p className="mx-auto mt-3 max-w-lg text-[0.97rem] leading-relaxed text-[var(--muted)]">
                Relax the filters or connect Next to PHP with{" "}
                <span className="font-mono text-[0.88rem] text-[var(--cyan)]">PARTYAXIS_BACKEND_URL</span>. Ready to seed
                listings? Jump to{" "}
                <a href={publishHref} className="font-semibold text-[var(--text)] underline-offset-4 hover:underline">
                  Publish an ad
                </a>
                .
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={resetAll}
                  className="rounded-full border border-[var(--border-strong)] bg-white/[0.04] px-6 py-3 text-[0.9rem] font-bold text-[var(--text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-[var(--cyan-soft)]"
                >
                  Reset filters
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((ev) => (
                <EventCard key={`${ev.id}-${ev.title}`} event={ev} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-full border px-4 py-2 text-[0.8rem] font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)] sm:min-h-0 ${
        active
          ? "border-[var(--cyan-soft)] bg-[rgba(56,189,248,0.1)] text-[var(--text)] shadow-[0_0_22px_-12px_var(--cyan-glow)]"
          : "border-white/[0.08] bg-white/[0.02] text-[var(--muted)] hover:border-white/15 hover:text-[var(--text)]"
      }`}
    >
      {label}
    </button>
  );
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (v: boolean) => void }) {
  const id = `fil-${label.replace(/\s+/g, "").toLowerCase()}`;
  return (
    <label htmlFor={id} className="inline-flex min-h-11 cursor-pointer select-none items-center gap-3 py-1 sm:min-h-0 sm:py-0">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        className="h-6 w-6 shrink-0 rounded border-[var(--border)] accent-[var(--cyan)] sm:h-5 sm:w-5"
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="font-semibold text-[var(--text)]">{label}</span>
    </label>
  );
}

function FeaturedCard({ event }: { event: PartyAxisEvent }) {
  return (
    <a
      href={`/events/${event.id}`}
      className="group relative min-w-[min(300px,82vw)] max-w-[340px] shrink-0 snap-center snap-always overflow-hidden rounded-[var(--pa-radius-xl)] border-2 border-[var(--accent-magenta)]/40 bg-[rgba(10,4,20,0.92)] no-underline shadow-[0_0_36px_rgba(129,140,248,0.15),inset_0_0_0_1px_rgba(56,189,248,0.06)] backdrop-blur-md transition hover:-translate-y-1 hover:border-[var(--cyan)]/45 hover:shadow-[0_0_44px_rgba(56,189,248,0.22)]"
    >
      <Thumbnail title={event.title} imageUrl={event.image_url} ratio="wide" />
      <div className="flex flex-col gap-3 px-5 py-6">
        <div className="flex items-center gap-3 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[var(--cyan)]">
          <span>{prettyDate(event.start_at)}</span>
          <span className="rounded-full bg-white/[0.04] px-2 py-[0.1rem] text-[0.7rem] text-[var(--text)]">{event.city}</span>
        </div>
        <div>
          <h3 className="text-lg font-extrabold leading-snug text-[var(--text)]">{event.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)] leading-relaxed">{event.description}</p>
        </div>
        {event.end_at && (
          <p className="text-[0.75rem] text-[var(--muted)]">
            Ends <span className="text-[var(--text-dim)]">{prettyDate(event.end_at)}</span>
          </p>
        )}
        <MetaRow event={event} />
        {/* Social share */}
        <ShareRow event={event} />
      </div>
    </a>
  );
}

function EventCard({ event }: { event: PartyAxisEvent }) {
  return (
    <a
      href={`/events/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-[var(--pa-radius-xl)] border border-[var(--border)] bg-[rgba(8,3,16,0.82)] no-underline shadow-[inset_0_0_0_1px_rgba(129,140,248,0.05)] backdrop-blur-md transition hover:-translate-y-1 hover:border-[var(--accent-magenta)]/35 hover:shadow-[0_20px_60px_-35px_rgba(129,140,248,0.2)]"
    >
      <Thumbnail title={event.title} imageUrl={event.image_url} ratio="card" decorative />
      <div className="flex flex-col gap-3 px-5 py-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.78rem] font-semibold text-[var(--muted)] uppercase tracking-[0.14em]">
          <span className="text-[var(--text)] lowercase tracking-normal">{prettyDate(event.start_at)}</span>
          {event.city && <span className="rounded-full bg-white/[0.06] px-2 py-[0.1rem] text-[0.74rem] text-[var(--text)] lowercase tracking-normal">{event.city}</span>}
          {event.is_highlight && (
            <span className="rounded-full border border-[var(--ok)]/35 bg-[var(--ok)]/10 px-2 py-[0.1rem] text-[0.68rem] font-bold text-[var(--ok)] shadow-[0_0_12px_rgba(52,211,153,0.18)]">
              Spotlight
            </span>
          )}
        </div>
        <h3 className="text-[1.1rem] font-extrabold leading-snug text-[var(--text)]">{event.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-[0.9rem] text-[var(--muted)]">{event.description}</p>
        {event.end_at && (
          <p className="text-[0.75rem] text-[var(--muted)]">
            Ends <span className="text-[var(--text-dim)]">{prettyDate(event.end_at)}</span>
          </p>
        )}
        <MetaRow event={event} muted />
        <ShareRow event={event} />
      </div>
    </a>
  );
}

function ShareRow({ event }: { event: PartyAxisEvent }) {
  const eventUrl = typeof window !== "undefined"
    ? `${window.location.origin}/events/${event.id}`
    : `/events/${event.id}`;
  const text = encodeURIComponent(`${event.title} — ${prettyDate(event.start_at)}`);
  const waUrl = `https://wa.me/?text=${text}%20${encodeURIComponent(eventUrl)}`;

  function copyLink(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(eventUrl).catch(() => null);
    const btn = e.currentTarget as HTMLButtonElement;
    const orig = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => { btn.textContent = orig; }, 1500);
  }

  function openWhatsApp(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    window.open(waUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mt-1 flex items-center gap-2 border-t border-white/[0.06] pt-3">
      <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--muted)]">Share</span>
      <button
        type="button"
        onClick={openWhatsApp}
        className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[0.72rem] font-bold text-[#25d366] transition hover:bg-[#25d366]/10 hover:border-[#25d366]/30"
        aria-label="Share on WhatsApp"
      >
        WhatsApp
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[0.72rem] font-bold text-[var(--muted)] transition hover:bg-white/[0.06] hover:text-[var(--text)]"
        aria-label="Copy link"
      >
        Copy link
      </button>
    </div>
  );
}

function Thumbnail({ title, imageUrl, ratio, decorative }: { title: string; imageUrl: string | null; ratio: "wide" | "card"; decorative?: boolean }) {
  const ratioClass = ratio === "wide" ? "aspect-[21/11]" : "aspect-[4/5] sm:aspect-[16/13] lg:aspect-[17/13]";
  const base = cx("relative isolate w-full bg-[rgba(255,255,255,0.02)] overflow-hidden", ratioClass);
  const safeUrl = sanitizeUrl(imageUrl);
  const altText = decorative ? "" : `${title} cover`;
  if (safeUrl) {
    return (
      <div className={base}>
        {/* eslint-disable-next-line @next/next/no-img-element -- remote promoter URLs */}
        <img
          src={safeUrl}
          alt={altText}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out will-change-transform motion-safe:group-hover:scale-[1.035]"
          decoding="async"
          loading={ratio === "wide" ? "eager" : "lazy"}
        />
        {decorative ? <span className="sr-only">{title}</span> : null}
      </div>
    );
  }
  return (
    <div className={`${base} flex items-center justify-center bg-[radial-gradient(circle_at_30%_-10%,rgba(56,189,248,0.18),transparent_72%),rgba(255,255,255,0.02)] px-10 text-center`}>
      <p className="text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Visual incoming</p>
    </div>
  );
}

function MetaRow({ event, muted }: { event: PartyAxisEvent; muted?: boolean }) {
  const toneClass = muted ? "text-[var(--muted)]" : "text-[var(--text)]";
  return (
    <div className={cx("mt-auto flex flex-wrap items-center justify-between gap-3 text-[0.78rem] font-semibold", toneClass)}>
      <span className="rounded-full bg-white/[0.04] px-2.5 py-1 lowercase tracking-normal text-[var(--text)]">{event.event_type}</span>
      <span>{event.visibility.replace("_", " ")}</span>
    </div>
  );
}

function blob(ev: PartyAxisEvent) {
  return [ev.title, ev.description, ev.city, ev.event_type, ev.visibility].filter(Boolean).join("\n").toLowerCase();
}

function ts(iso: string | null): number {
  if (!iso) return Number.MAX_SAFE_INTEGER;
  const d = new Date(iso);
  return Number.isFinite(d.getTime()) ? d.getTime() : Number.MAX_SAFE_INTEGER;
}

function prettyDate(iso: string | null) {
  if (!iso) return "Date TBD";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "Date TBD";
  return new Intl.DateTimeFormat("en-SG", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Singapore",
    hour12: true,
  }).format(d);
}

function sanitizeUrl(url: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}
