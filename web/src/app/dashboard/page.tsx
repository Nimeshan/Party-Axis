import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NewsletterStrip } from "@/components/newsletter-strip";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Party Axis submissions and account overview.",
};

export default function DashboardPage() {
  return (
    <div className="pa-page-root flex min-h-[100vh] flex-col bg-transparent text-[var(--text)] antialiased">
      <div className="pa-sticky-stack">
        <NewsletterStrip />
        <SiteHeader />
      </div>

      <main
        className="flex flex-1 flex-col py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:py-14"
        aria-labelledby="dashboard-heading"
      >
        <div className="mx-auto w-[var(--pa-content)]">
          <h1 id="dashboard-heading" className="pa-headline text-[clamp(2rem,5vw,3rem)] text-[var(--text)]">
            Dashboard
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            Your submitted listings and their moderation status.
          </p>

          <div className="mt-10 pa-panel p-6 sm:p-8">
            <UserSubmissions />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function UserSubmissions() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-[var(--text)]">My submissions</h2>
        <Link
          href="/publish"
          className="pa-btn-primary inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs text-[var(--surface)] no-underline"
        >
          + Publish new ad
        </Link>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--warn)]" />
          <span className="text-[var(--muted)]">Pending review</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--ok)]" />
          <span className="text-[var(--muted)]">Approved</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[rgba(255,120,120,0.9)]" />
          <span className="text-[var(--muted)]">Rejected</span>
        </span>
      </div>

      {/* Empty state — shown when backend is not connected or no events yet */}
      <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-14 text-center">
        <p className="text-[var(--text)] font-semibold">No submissions yet</p>
        <p className="mt-2 text-sm text-[var(--muted)] max-w-sm mx-auto">
          Once you submit a listing it will appear here with its live status — pending, approved, or rejected with moderator notes.
        </p>
        <Link
          href="/publish"
          className="mt-6 inline-flex items-center justify-center rounded-full border border-[var(--cyan-soft)] bg-[var(--cyan-soft)]/20 px-6 py-2.5 text-sm font-bold text-[var(--cyan)] no-underline transition hover:bg-[var(--cyan-soft)]/30"
        >
          Submit your first listing
        </Link>
      </div>

      <p className="text-xs text-[var(--muted)]">
        Connect <code className="font-mono text-[var(--cyan)]">PARTYAXIS_BACKEND_URL</code> to load live submission data from your account.
      </p>
    </div>
  );
}
