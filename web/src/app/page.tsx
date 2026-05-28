import { EventsShell } from "@/components/events-shell";
import { HomeBelowHero } from "@/components/home-below-hero";
import { HomeHero } from "@/components/home-hero";
import { NewsletterStrip } from "@/components/newsletter-strip";
import { PartnerStrip } from "@/components/partner-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { fetchApprovedEvents } from "@/lib/events";

export default async function Home() {
  const events = await fetchApprovedEvents();

  const legacyBase = process.env.NEXT_PUBLIC_LEGACY_SITE_URL?.trim().replace(/\/$/, "") ?? "";
  const publishHref = legacyBase ? `${legacyBase}/create-event.html` : "/publish";

  return (
    <div className="pa-page-root pa-home flex min-h-[100vh] flex-col bg-transparent text-[var(--text)] antialiased">
      <div className="pa-sticky-stack">
        <NewsletterStrip />
        <SiteHeader />
      </div>

      <main
        id="publish"
        className="relative flex flex-1 flex-col pb-[env(safe-area-inset-bottom)]"
        aria-label="Party Axis home"
      >
        {/* Softer home-only ambience — teal / indigo dusk instead of heavy magenta wash */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[min(92vh,960px)] overflow-hidden" aria-hidden>
          <div className="absolute -left-[18%] top-[-42%] h-[min(640px,95vw)] w-[min(640px,95vw)] rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.11),transparent_68%)] blur-3xl" />
          <div className="absolute -right-[12%] top-[6%] h-[min(520px,85vw)] w-[min(560px,90vw)] rounded-full bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.14),transparent_65%)] blur-3xl" />
          <div className="absolute bottom-[-35%] left-[28%] h-[min(480px,80vw)] w-[min(480px,80vw)] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.07),transparent_70%)] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.25)_0%,transparent_55%)]" />
        </div>

        <div className="relative z-[1] flex flex-1 flex-col">
          <HomeHero publishHref={publishHref} />
          <HomeBelowHero events={events} publishHref={publishHref} />
          <EventsShell events={events} publishHref={publishHref} />
          <PartnerStrip />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
