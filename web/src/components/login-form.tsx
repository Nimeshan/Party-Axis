"use client";

import Link from "next/link";
import { useId, useState } from "react";

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function LoginForm() {
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");

    if (!validEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-xl border border-[var(--cyan-soft)] bg-[rgba(0,212,232,0.06)] px-4 py-5 text-sm leading-relaxed text-[var(--text)]">
        <p className="font-semibold text-[var(--ok)]">Check your details</p>
        <p className="mt-2 text-[var(--muted)]">
          Party Axis sign-in is not connected to a live account system yet. We captured your attempt locally — hook this
          form to your backend when you&apos;re ready.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex font-semibold text-[var(--cyan)] no-underline hover:underline"
        >
          Back to home
        </Link>
      </div>
    );
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

      <button type="submit" className="pa-btn-primary mt-1 w-full rounded-full py-3.5 text-base font-extrabold text-[var(--surface)] no-underline">
        Log in
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
