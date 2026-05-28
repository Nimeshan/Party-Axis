"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function LoginForm() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const remember = fd.get("remember") === "on";

    if (!validEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, remember }),
      });
      const data: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(typeof data.error === "string" ? data.error : "Couldn't sign in. Try again.");
        return;
      }
      router.replace("/dashboard");
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
      {error ? (
        <p className="rounded-lg border border-[rgba(255,120,120,0.35)] bg-[rgba(80,20,20,0.35)] px-3 py-2 text-sm text-[#ffc9c9]" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor={emailId} className="text-sm font-semibold text-[var(--text)]">
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="rounded-xl border border-[var(--border)] bg-[rgba(5,8,14,0.85)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan-soft)]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <label htmlFor={passwordId} className="text-sm font-semibold text-[var(--text)]">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[var(--cyan)] no-underline hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id={passwordId}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          className="rounded-xl border border-[var(--border)] bg-[rgba(5,8,14,0.85)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan-soft)]"
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--muted)]">
        <input
          id={rememberId}
          name="remember"
          type="checkbox"
          className="mt-1 size-4 shrink-0 rounded border-[var(--border)] bg-[rgba(5,8,14,0.85)] text-[var(--cyan)] focus:ring-[var(--cyan)]"
        />
        <span>
          <span className="font-medium text-[var(--text)]">Stay signed in</span> on this device (not recommended on
          shared computers).
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="pa-btn-primary mt-1 w-full rounded-full py-3.5 text-base font-extrabold text-[var(--surface)] no-underline disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Log in"}
      </button>

      <p className="text-center text-sm text-[var(--muted)]">
        No account yet?{" "}
        <Link href="/signup" className="font-semibold text-[var(--cyan)] no-underline hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
