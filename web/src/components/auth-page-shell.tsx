import { NewsletterStrip } from "@/components/newsletter-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function AuthPageShell({
  children,
  title,
  description,
}: Readonly<{
  children: React.ReactNode;
  title: string;
  description?: string;
}>) {
  return (
    <div className="pa-page-root flex min-h-[100vh] flex-col bg-transparent text-[var(--text)] antialiased">
      <div className="pa-sticky-stack">
        <NewsletterStrip />
        <SiteHeader />
      </div>

      <main
        className="flex flex-1 flex-col items-center py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:py-14 sm:pb-14"
        aria-labelledby="auth-heading"
      >
        <div className="pa-panel pa-fade-up w-full max-w-[min(460px,100%)] p-6 sm:p-9">
          <h1 id="auth-heading" className="pa-headline text-3xl sm:text-[2.35rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
          ) : null}
          <div className="mt-8">{children}</div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
