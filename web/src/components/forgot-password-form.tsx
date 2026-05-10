"use client";

import Link from "next/link";
import { useId, useState } from "react";

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ForgotPasswordForm() {
  const emailId = useId();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    if (!validEmail(email)) {
      setError("Enter the email you used to sign up.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-xl border border-[var(--cyan-soft)] bg-[rgba(0,212,232,0.06)] px-4 py-5 text-sm leading-relaxed text-[var(--text)]">
        <p className="font-semibold text-[var(--ok)]">If this email exists, we&apos;ll send a link</p>
        <p className="mt-2 text-[var(--muted)]">
          Password reset is not active yet — this message is a preview of the flow. Implement your mailer and token store
          on the server to finish it.
        </p>
        <Link href="/login" className="mt-4 inline-flex font-semibold text-[var(--cyan)] no-underline hover:underline">
          Back to log in
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
          Email on your account
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

      <button type="submit" className="pa-btn-primary w-full rounded-full py-3.5 text-base font-extrabold text-[var(--surface)] no-underline">
        Send reset link
      </button>

      <p className="text-center text-sm text-[var(--muted)]">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-[var(--cyan)] no-underline hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
