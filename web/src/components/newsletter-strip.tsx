"use client";

import { useId, useMemo, useState } from "react";

const legacy =
  process.env.NEXT_PUBLIC_LEGACY_SITE_URL?.trim().replace(/\/$/, "") || "";

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type NewsletterVariant = "banner" | "drawer";

export function NewsletterStrip({ variant = "banner" }: { variant?: NewsletterVariant }) {
  const rootId = useId();
  const emailId = `${rootId}-email`;
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const disabled = useMemo(() => status === "loading", [status]);
  const source =
    variant === "drawer" ? "drawer_menu" : "home_newsletter_strip";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const trimmed = email.trim();
    if (!trimmed || !marketingConsent) {
      setStatus("err");
      setMessage("Enter a valid email and opt in to receive updates.");
      return;
    }

    setStatus("loading");
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          email: trimmed,
          marketing_consent: true,
          source,
        }),
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok || json?.ok !== true) {
        setStatus("err");
        setMessage(String(json?.error || "Signup failed."));
        return;
      }
      setStatus("ok");
      setEmail("");
      setMarketingConsent(false);
      setMessage("Thanks — you’re on the list.");
    } catch {
      setStatus("err");
      setMessage("Something went wrong. Try again in a minute.");
    }
  }

  if (variant === "drawer") {
    return (
      <section
        className="relative overflow-hidden border-t border-[var(--border)] bg-[linear-gradient(180deg,rgba(8,0,16,0.95),rgba(4,0,10,0.92))] px-3 py-5"
        aria-label="Guest list signup"
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[image:var(--pa-gradient-cta)] opacity-90 shadow-[0_0_16px_var(--pink-glow)]"
          aria-hidden
        />
        <p className="pa-club-sub mb-3 text-[0.68rem] leading-snug text-[var(--text)]">
          <span className="text-[var(--accent-magenta)]">Guest list</span>
          <span className="text-[var(--muted)] normal-case tracking-normal">
            {" "}
            · Friday drops &amp; weekend warfare in your inbox
          </span>
        </p>
        <form className="flex flex-col gap-2" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor={emailId}>
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            disabled={disabled}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-11 w-full rounded-md border border-[var(--accent-magenta)]/25 bg-[rgba(8,2,16,0.9)] px-3.5 text-base text-[var(--text)] shadow-[inset_0_0_0_1px_rgba(0,245,255,0.06)] outline-none placeholder:text-[var(--muted)] focus-visible:border-[var(--cyan)] focus-visible:ring-2 focus-visible:ring-[var(--cyan-soft)]"
          />
          <button
            type="submit"
            disabled={disabled}
            className={cx(
              "min-h-11 w-full shrink-0 rounded-md px-4 text-xs font-extrabold uppercase tracking-[0.14em] text-[#050108]",
              "bg-[image:var(--pa-gradient-cta)]",
              "shadow-[0_0_28px_rgba(255,45,149,0.25)]",
              disabled ? "opacity-60" : "hover:brightness-110 hover:shadow-[0_0_36px_rgba(0,245,255,0.35)]",
            )}
          >
            Get in
          </button>
        </form>
        <label className="mt-3 flex min-h-10 cursor-pointer select-none items-start gap-2.5 text-[0.7rem] leading-snug text-[var(--muted)]">
          <input
            type="checkbox"
            checked={marketingConsent}
            disabled={disabled}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 rounded-sm border-[var(--accent-magenta)]/40 bg-[rgba(6,2,12,0.9)] accent-[var(--accent-magenta)]"
          />
          <span>
            Blast me listings &amp; promos. Unsubscribe anytime.{" "}
            <a
              className="font-semibold text-[var(--cyan)] underline-offset-2 hover:underline"
              href={legacy ? `${legacy}/privacy.html` : "/privacy"}
            >
              Privacy
            </a>
            .
          </span>
        </label>
        {message ? (
          <p
            className={cx(
              "mt-3 text-[0.7rem] font-semibold",
              status === "ok" ? "text-[var(--ok)]" : "text-[var(--warn)]",
            )}
            role="status"
          >
            {message}
          </p>
        ) : (
          <p className="mt-2 text-[0.65rem] font-medium uppercase tracking-wider text-[var(--muted)]">
            No spam · SG &amp; regional
          </p>
        )}
      </section>
    );
  }

  return (
    <div className="relative hidden overflow-hidden border-b border-[var(--border)] bg-[#080010] lg:block">
      <div
        className="absolute inset-y-0 left-0 w-1 bg-[image:var(--pa-gradient-cta)] shadow-[0_0_20px_var(--pink-glow)]"
        aria-hidden
      />
      <div
        className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[rgba(192,38,255,0.08)] to-transparent"
        aria-hidden
      />
      <div className="mx-auto flex w-[var(--pa-content)] flex-col gap-3 py-3.5 pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pl-0 sm:pr-0">
        <p className="text-center pa-club-sub text-[var(--text)] sm:text-left">
          <span className="text-[var(--accent-magenta)]">Guest list</span>
          <span className="text-[var(--muted)] normal-case tracking-normal">
            {" "}
            · Friday drops &amp; weekend warfare in your inbox
          </span>
        </p>
        <form
          className="flex flex-1 flex-col gap-2 sm:max-w-[min(520px,100%)] sm:flex-row sm:items-center sm:justify-end"
          onSubmit={onSubmit}
        >
          <label className="sr-only" htmlFor={emailId}>
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            disabled={disabled}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-11 h-11 w-full rounded-md border border-[var(--accent-magenta)]/25 bg-[rgba(8,2,16,0.9)] px-4 text-base text-[var(--text)] shadow-[inset_0_0_0_1px_rgba(0,245,255,0.06)] outline-none placeholder:text-[var(--muted)] focus-visible:border-[var(--cyan)] focus-visible:ring-2 focus-visible:ring-[var(--cyan-soft)] sm:text-sm"
          />
          <button
            type="submit"
            disabled={disabled}
            className={cx(
              "min-h-11 h-11 w-full shrink-0 rounded-md px-5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#050108] sm:w-auto",
              "bg-[image:var(--pa-gradient-cta)]",
              "shadow-[0_0_28px_rgba(255,45,149,0.25)]",
              disabled ? "opacity-60" : "hover:brightness-110 hover:shadow-[0_0_36px_rgba(0,245,255,0.35)]",
            )}
          >
            Get in
          </button>
        </form>
      </div>
      <div className="mx-auto flex w-[var(--pa-content)] flex-col pb-[max(0.875rem,env(safe-area-inset-bottom))] pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] sm:flex-row sm:items-center sm:justify-between sm:pb-3.5 sm:pl-0 sm:pr-0">
        <label className="flex min-h-11 cursor-pointer select-none items-center gap-3 py-1 text-xs leading-snug text-[var(--muted)] sm:mr-6 sm:min-h-0 sm:items-start sm:gap-2.5 sm:py-0">
          <input
            type="checkbox"
            checked={marketingConsent}
            disabled={disabled}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="h-5 w-5 shrink-0 rounded-sm border-[var(--accent-magenta)]/40 bg-[rgba(6,2,12,0.9)] accent-[var(--accent-magenta)] sm:mt-0.5 sm:h-4 sm:w-4"
          />
          <span>
            Blast me listings &amp; promos. Unsubscribe anytime.{" "}
            <a
              className="font-semibold text-[var(--cyan)] underline-offset-2 hover:underline"
              href={legacy ? `${legacy}/privacy.html` : "/privacy"}
            >
              Privacy
            </a>
            .
          </span>
        </label>
        {message ? (
          <p
            className={cx(
              "mt-2 text-xs font-semibold sm:mt-0",
              status === "ok" ? "text-[var(--ok)]" : "text-[var(--warn)]",
            )}
            role="status"
          >
            {message}
          </p>
        ) : (
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)] sm:mt-0">
            No spam · SG &amp; regional
          </p>
        )}
      </div>
    </div>
  );
}
