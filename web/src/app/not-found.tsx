import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NewsletterStrip } from "@/components/newsletter-strip";

export default function NotFound() {
  return (
    <div className="pa-page-root flex min-h-[100vh] flex-col bg-transparent text-[var(--text)] antialiased">
      <div className="pa-sticky-stack">
        <NewsletterStrip />
        <SiteHeader />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <p className="pa-club-sub text-[var(--accent-magenta)]">404</p>
        <h1 className="pa-headline mt-4 text-[clamp(2.5rem,8vw,5rem)] text-[var(--text)]">
          Wrong room
        </h1>
        <p className="mt-5 max-w-md text-[var(--muted)]">
          This page doesn&apos;t exist or has been moved. Head back to the floor and find your night.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="pa-btn-primary inline-flex items-center justify-center rounded-full px-8 py-3 text-sm text-[var(--surface)] no-underline"
          >
            Back to home
          </Link>
          <Link
            href="/#browse"
            className="inline-flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] px-8 py-3 text-sm font-bold text-[var(--text)] no-underline transition hover:bg-white/[0.08]"
          >
            Browse events
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
