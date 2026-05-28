import { NewsletterStrip } from "@/components/newsletter-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function LegalPageShell({
  children,
  title,
  description,
  lastUpdated,
}: Readonly<{
  children: React.ReactNode;
  title: string;
  description?: string;
  lastUpdated: string;
}>) {
  return (
    <div className="pa-page-root flex min-h-[100vh] flex-col bg-transparent text-[var(--text)] antialiased">
      <div className="pa-sticky-stack">
        <NewsletterStrip />
        <SiteHeader />
      </div>

      <main
        className="flex flex-1 flex-col items-center py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:py-12 sm:pb-12"
        aria-labelledby="legal-heading"
      >
        <article className="pa-panel pa-fade-up w-full max-w-[min(720px,100%)] p-6 sm:p-9">
          <h1 id="legal-heading" className="pa-headline text-3xl sm:text-[2.35rem]">
            {title}
          </h1>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Last updated {lastUpdated}
          </p>
          {description ? (
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
          ) : null}
          <div className="mt-10 space-y-8 text-sm leading-relaxed text-[var(--muted)]">{children}</div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
