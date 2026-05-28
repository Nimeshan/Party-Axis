"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

import { NewsletterStrip } from "@/components/newsletter-strip";

const legacy =
  process.env.NEXT_PUBLIC_LEGACY_SITE_URL?.trim().replace(/\/$/, "") || "";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const panelId = useId();

  const browseHref     = legacy ? `${legacy}/events.html`     : "/#browse";
  const highlightsHref = legacy ? `${legacy}/highlights.html` : "/#highlights";
  const signupHref     = legacy ? `${legacy}/signup.html`     : "/signup";
  const loginHref      = legacy ? `${legacy}/login.html`      : "/login";
  const publishHref    = legacy ? `${legacy}/create-event.html` : "/publish";
  const dashboardHref  = "/dashboard";

  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const navClsDesktop =
    "inline-flex min-h-11 shrink-0 items-center justify-center rounded-md px-3.5 py-2 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)] transition hover:bg-[rgba(99,102,241,0.1)] hover:text-[var(--text)]";

  const drawerNavCls =
    "flex min-h-[52px] items-center gap-3 border-b border-white/[0.06] px-4 text-[0.85rem] font-bold uppercase tracking-[0.14em] text-[var(--text)] no-underline outline-none transition hover:bg-[rgba(99,102,241,0.08)] focus-visible:bg-[rgba(56,189,248,0.08)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--cyan-soft)]";

  return (
    <header className="border-b border-[var(--border)] bg-transparent">
      <div className="mx-auto w-[var(--pa-content)] py-3 pl-[max(0px,env(safe-area-inset-left))] pr-[max(0px,env(safe-area-inset-right))]">
        {/* Mobile + tablet */}
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <a
            className="group inline-flex min-h-11 min-w-0 shrink-0 items-center rounded-md transition hover:shadow-[0_0_24px_rgba(56,189,248,0.12)]"
            href="/"
            onClick={closeMenu}
          >
            <Image
              src="/logo.jpg"
              alt="Party Axis"
              width={340}
              height={92}
              className="h-[48px] w-auto max-w-[min(200px,62vw)] object-contain transition duration-300 group-hover:brightness-125"
              priority
            />
          </a>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-[var(--accent-magenta)]/30 bg-[rgba(12,4,22,0.9)] text-[var(--text)] shadow-[inset_0_0_0_1px_rgba(56,189,248,0.05)] transition hover:border-[var(--cyan)] hover:text-[var(--cyan)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)]"
            aria-expanded={menuOpen}
            aria-controls={panelId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">{menuOpen ? "Close" : "Menu"}</span>
            {menuOpen ? <HamburgerIcon open /> : <HamburgerIcon />}
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden min-h-[3.5rem] items-center gap-6 lg:flex">
          <a
            className="group inline-flex shrink-0 items-center rounded-md transition hover:shadow-[0_0_24px_rgba(56,189,248,0.12)]"
            href="/"
          >
            <Image
              src="/logo.jpg"
              alt="Party Axis"
              width={340}
              height={92}
              className="h-[72px] w-auto max-w-[min(280px,26vw)] object-contain transition duration-300 group-hover:brightness-125"
              priority
            />
          </a>

          <nav className="flex min-w-0 flex-1 justify-center" aria-label="Primary">
            <div className="flex flex-wrap items-center justify-center gap-1 rounded-md border border-[var(--accent-magenta)]/18 bg-[rgba(8,2,18,0.75)] p-1 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.05)]">
              <a href="/" className={navClsDesktop}>Home</a>
              <a href={browseHref} className={navClsDesktop}>Events</a>
              <a href={highlightsHref} className={navClsDesktop}>Highlights</a>
              <a href={dashboardHref} className={navClsDesktop}>Dashboard</a>
            </div>
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-2">
            <HeaderButton variant="pill" href={signupHref} label="Sign up" />
            <HeaderButton variant="pill" href={loginHref} label="Login" />
            <HeaderButton variant="gradient" href={publishHref} label="Publish" />
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[80] bg-[rgba(2,1,6,0.72)] backdrop-blur-md transition-[opacity,visibility] duration-200 lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
        onClick={closeMenu}
      />

      {/* Drawer */}
      <div
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed inset-y-0 right-0 z-[90] flex min-h-0 w-[min(22.5rem,calc(100vw-env(safe-area-inset-left)-env(safe-area-inset-right)))] max-w-full flex-col border-l border-[var(--accent-magenta)]/22 bg-[linear-gradient(200deg,rgba(12,4,22,0.98),rgba(3,1,8,0.99))] pt-[env(safe-area-inset-top,0px)] shadow-[-24px_0_80px_rgba(0,0,0,0.75)] transition-transform duration-200 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-3">
          <p className="pa-club-sub text-[0.7rem] text-[var(--accent-magenta)]">Menu</p>
          <button
            type="button"
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-white/10 text-lg leading-none text-[var(--muted)] transition hover:border-[var(--cyan)]/40 hover:text-[var(--text)]"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav
          className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]"
          aria-label="Primary"
        >
          <a href="/" className={drawerNavCls} onClick={closeMenu}>Home</a>
          <a href={browseHref} className={drawerNavCls} onClick={closeMenu}>Events</a>
          <a href={highlightsHref} className={drawerNavCls} onClick={closeMenu}>Highlights</a>
          <a href={dashboardHref} className={drawerNavCls} onClick={closeMenu}>Dashboard</a>

          <NewsletterStrip variant="drawer" />

          <p className="pa-club-sub mt-5 px-4 text-[0.65rem] text-[var(--muted)]">Account</p>
          <a href={signupHref} className={`${drawerNavCls} mt-1`} onClick={closeMenu}>Sign up</a>
          <a href={loginHref} className={drawerNavCls} onClick={closeMenu}>Login</a>

          <div className="mt-auto px-4 pb-1 pt-6">
            <a
              href={publishHref}
              className="flex min-h-[52px] w-full items-center justify-center rounded-md border border-[var(--cyan)]/25 bg-[image:var(--pa-gradient-cta)] px-4 text-xs font-extrabold uppercase tracking-[0.12em] text-[#050108] no-underline shadow-[0_0_28px_rgba(129,140,248,0.2)] transition hover:brightness-110"
              onClick={closeMenu}
            >
              Publish an Ad
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function HamburgerIcon({ open }: { open?: boolean }) {
  const line = "h-0.5 w-5 rounded-full bg-current transition-[transform,opacity] duration-200 ease-out";
  return (
    <span className="flex h-5 w-5 flex-col items-center justify-center gap-[5px]" aria-hidden>
      <span className={`${line} origin-center ${open ? "translate-y-[7px] rotate-45" : ""}`} />
      <span className={`${line} ${open ? "scale-x-0 opacity-0" : ""}`} />
      <span className={`${line} origin-center ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
    </span>
  );
}

function HeaderButton({ href, label, variant }: { href: string; label: string; variant: "pill" | "gradient" }) {
  const sizing = "min-h-11 justify-center px-3.5 py-2 text-[0.68rem] uppercase tracking-[0.12em] lg:px-4 lg:py-[0.55rem] lg:text-xs";

  const base =
    variant === "gradient"
      ? "rounded-md border border-[var(--cyan)]/22 bg-[image:var(--pa-gradient-cta)] font-extrabold text-[#050108] shadow-[0_0_28px_rgba(129,140,248,0.2)] transition hover:brightness-110 hover:shadow-[0_0_36px_rgba(56,189,248,0.28)]"
      : "rounded-md border border-[var(--accent-magenta)]/28 bg-[rgba(12,4,22,0.85)] font-bold text-[var(--text)] shadow-[inset_0_0_0_1px_rgba(56,189,248,0.04)] transition hover:border-[var(--cyan)] hover:text-[var(--cyan)]";

  const labelText = variant === "gradient" && label === "Publish" ? "Publish an Ad" : label;

  return (
    <a href={href} className={`inline-flex items-center no-underline ${sizing} ${base}`}>
      {labelText}
    </a>
  );
}
