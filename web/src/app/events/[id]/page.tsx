import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NewsletterStrip } from "@/components/newsletter-strip";
import { fetchApprovedEvents } from "@/lib/events";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const events = await fetchApprovedEvents();
  const event = events.find((e) => String(e.id) === id);
  if (!event) return { title: "Event not found" };
  return {
    title: event.title,
    description: event.description?.slice(0, 160),
  };
}

function prettyDate(iso: string | null) {
  if (!iso) return "Date TBD";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "Date TBD";
  return new Intl.DateTimeFormat("en-SG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Singapore",
    hour12: true,
  }).format(d);
}

function sanitizeUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return parsed.toString();
  } catch { return null; }
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const events = await fetchApprovedEvents();
  const event = events.find((e) => String(e.id) === id);

  if (!event) {
    return (
      <div className="pa-page-root flex min-h-[100vh] flex-col bg-transparent text-[var(--text)] antialiased">
        <div className="pa-sticky-stack">
          <NewsletterStrip />
          <SiteHeader />
        </div>
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-20">
          <h1 className="pa-headline text-4xl text-[var(--text)]">Event not found</h1>
          <p className="mt-4 text-[var(--muted)]">This listing may have been removed or is no longer live.</p>
          <Link href="/#browse" className="mt-8 font-semibold text-[var(--cyan)] hover:underline">
            ← Back to Explorer
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const safeImage = sanitizeUrl(event.image_url);
  const safeTicket = sanitizeUrl(event.ticket_url ?? null);
  const mapsQuery = encodeURIComponent(`${event.location_name ?? ""} ${event.address ?? ""} ${event.city}`);
  const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/events/${event.id}`;
  const waText = encodeURIComponent(`${event.title} — ${prettyDate(event.start_at)}\n${shareUrl}`);

  return (
    <div className="pa-page-root flex min-h-[100vh] flex-col bg-transparent text-[var(--text)] antialiased">
      <div className="pa-sticky-stack">
        <NewsletterStrip />
        <SiteHeader />
      </div>

      <main className="flex flex-1 flex-col pb-[env(safe-area-inset-bottom)]">
        {/* Hero image */}
        {safeImage && (
          <div className="relative h-[min(55vh,480px)] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={safeImage} alt={`${event.title} cover`} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/40 to-transparent" />
          </div>
        )}

        <div className="mx-auto w-[var(--pa-content)] py-10 sm:py-14">
          <Link href="/#browse" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] no-underline transition hover:text-[var(--text)]">
            ← Back to Explorer
          </Link>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
            {/* Left: main info */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {event.is_highlight && (
                  <span className="rounded-full border border-[var(--ok)]/35 bg-[var(--ok)]/10 px-3 py-1 text-xs font-bold text-[var(--ok)]">
                    Spotlight
                  </span>
                )}
                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold capitalize text-[var(--muted)]">
                  {event.event_type}
                </span>
              </div>

              <h1 className="pa-headline mt-5 text-[clamp(2rem,6vw,3.5rem)] text-[var(--text)]">
                {event.title}
              </h1>

              <div className="mt-6 grid gap-3 text-sm text-[var(--muted)]">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-[var(--cyan)]">📅</span>
                  <div>
                    <p className="font-semibold text-[var(--text)]">{prettyDate(event.start_at)}</p>
                    {event.end_at && <p className="mt-1">Ends {prettyDate(event.end_at)}</p>}
                  </div>
                </div>
                {(event.location_name || event.address) && (
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-[var(--accent-magenta)]">📍</span>
                    <div>
                      {event.location_name && <p className="font-semibold text-[var(--text)]">{event.location_name}</p>}
                      {event.address && <p className="mt-0.5">{event.address}</p>}
                      <p className="mt-0.5">{event.city}</p>
                    </div>
                  </div>
                )}
                {event.organizer && (
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-[var(--accent-violet)]">🎤</span>
                    <p><span className="font-semibold text-[var(--text)]">Promoter:</span> {event.organizer}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 prose-sm max-w-none text-[var(--muted)] leading-relaxed">
                <p className="whitespace-pre-line">{event.description}</p>
              </div>

              {/* Google Maps embed */}
              {(event.address || event.location_name) && (
                <div className="mt-10">
                  <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-[var(--muted)]">Location</h2>
                  <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
                    <iframe
                      src={mapsEmbedUrl}
                      width="100%"
                      height="280"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map for ${event.location_name ?? event.city}`}
                    />
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-semibold text-[var(--cyan)] hover:underline"
                  >
                    Open in Google Maps ↗
                  </a>
                </div>
              )}
            </div>

            {/* Right: action panel */}
            <aside className="flex flex-col gap-5">
              <div className="pa-panel p-6">
                {safeTicket ? (
                  <a
                    href={safeTicket}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pa-btn-primary flex min-h-[3rem] w-full items-center justify-center rounded-full text-sm text-[var(--surface)] no-underline"
                  >
                    Get tickets ↗
                  </a>
                ) : (
                  <p className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-center text-sm text-[var(--muted)]">
                    No ticket link provided
                  </p>
                )}

                <div className="mt-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Share this event</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`https://wa.me/?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-[#25d366]/25 bg-[#25d366]/[0.07] px-3 py-2 text-xs font-bold text-[#25d366] no-underline transition hover:bg-[#25d366]/15"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`https://www.instagram.com/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-[var(--accent-magenta)]/25 bg-[var(--accent-magenta)]/[0.07] px-3 py-2 text-xs font-bold text-[var(--accent-magenta)] no-underline transition hover:bg-[var(--accent-magenta)]/15"
                    >
                      Instagram
                    </a>
                    <CopyLinkButton url={shareUrl} />
                  </div>
                </div>

                <dl className="mt-6 grid gap-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-[var(--muted)]">Visibility</dt>
                    <dd className="font-semibold text-[var(--text)] capitalize">{event.visibility.replace("_", " ")}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-[var(--muted)]">City</dt>
                    <dd className="font-semibold text-[var(--text)]">{event.city}</dd>
                  </div>
                </dl>
              </div>

              <Link
                href="/#browse"
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-center text-sm font-semibold text-[var(--muted)] no-underline transition hover:bg-white/[0.06] hover:text-[var(--text)]"
              >
                ← Browse more events
              </Link>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

// Client component for copy-to-clipboard in a server page
function CopyLinkButton({ url }: { url: string }) {
  // Pure HTML button — works without client JS for the copy action we add via onClick in a client boundary
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard.writeText(url).catch(() => null); }}
      className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-xs font-bold text-[var(--muted)] transition hover:bg-white/[0.08] hover:text-[var(--text)]"
    >
      Copy link
    </button>
  );
}
