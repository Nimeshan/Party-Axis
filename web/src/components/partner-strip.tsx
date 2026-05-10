const legacy =
  process.env.NEXT_PUBLIC_LEGACY_SITE_URL?.trim().replace(/\/$/, "") || "";

const slots = [
  {
    name: "Headline marquee",
    blurb: "Own the takeover rail above discovery — cinematic still or short loop.",
  },
  {
    name: "Category captain",
    blurb: "Badge your vodka, audio, or travel brand beside the nightlife filters.",
  },
  {
    name: "Post-event epilogue",
    blurb: "Retarget sweaty thumbs with recovery, merch, or afters partners.",
  },
];

export function PartnerStrip() {
  return (
    <section
      id="partner"
      aria-label="Partner placements"
      className="border-y border-[var(--border)] bg-[linear-gradient(180deg,rgba(18,24,42,0.45),rgba(8,11,22,0.35))] backdrop-blur-sm"
    >
      <div className="mx-auto w-[var(--pa-content)] py-20 md:py-24">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="pa-section-eyebrow">Sponsor pit</p>
            <h2 className="pa-headline mt-4 text-[clamp(1.85rem,4vw,2.45rem)] text-[var(--text)] md:text-[2.65rem]">
              Reserved for partner stories
            </h2>
            <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-[var(--muted)]">
              As traffic scales, marquee slots evolve into CPC/flat sponsorships · start planning creative now so
              moderator-approved events never feel cluttered.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-[0.9rem] font-bold sm:flex-row sm:flex-wrap">
            <a
              href="mailto:sponsorships@partyaxis.com"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[var(--border-strong)] bg-transparent px-6 py-3.5 text-[var(--text)] no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-[var(--cyan)] hover:bg-white/[0.04] sm:w-auto sm:min-h-0"
            >
              Talk integrations
            </a>
            <a
              href={legacy ? `${legacy}/privacy.html` : "/privacy"}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white/[0.09] px-6 py-3.5 text-[var(--text)] no-underline transition hover:bg-white/[0.16] sm:w-auto sm:min-h-0"
            >
              Review brand rules
            </a>
          </div>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {slots.map((slot) => (
            <article
              key={slot.name}
              className="flex min-h-[188px] flex-col rounded-[var(--pa-radius-2xl)] border border-dashed border-[var(--border-strong)] bg-[linear-gradient(145deg,rgba(34,211,238,0.06),rgba(167,139,250,0.04)_50%,transparent)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md"
            >
              <header className="space-y-2">
                <h3 className="text-lg font-semibold tracking-tight text-[var(--text)]">{slot.name}</h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">{slot.blurb}</p>
              </header>
              <div className="mt-auto rounded-[var(--pa-radius-xl)] border border-[var(--border)] bg-black/35 px-5 py-3.5 text-[0.8rem] font-semibold text-[var(--muted)]">
                Slot reserved · creatives via Party Axis partnerships desk
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
