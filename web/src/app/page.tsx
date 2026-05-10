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
    <div className="pa-page-root flex min-h-[100vh] flex-col bg-transparent text-[var(--text)] antialiased">
      <div className="pa-sticky-stack">
        <NewsletterStrip />
        <SiteHeader />
      </div>

      <main
        id="publish"
        className="flex flex-1 flex-col pb-[env(safe-area-inset-bottom)]"
        aria-label="Party Axis home"
      >
        <HomeHero publishHref={publishHref} />
        <HomeBelowHero events={events} publishHref={publishHref} />
        <EventsShell events={events} publishHref={publishHref} />
        <PartnerStrip />
      </main>

      <SiteFooter />
    </div>
  );
}
