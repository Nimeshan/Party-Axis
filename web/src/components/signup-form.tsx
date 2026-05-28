"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function passwordIssues(password: string): string[] {
  const issues: string[] = [];
  if (password.length < 10) issues.push("at least 10 characters");
  if (!/[a-z]/i.test(password)) issues.push("one letter");
  if (!/\d/.test(password)) issues.push("one number");
  return issues;
}

/** Client-side check: minimum age from YYYY-MM-DD (matches PHP `age_21_plus`). */
function minAge(isoDate: string, years: number) {
  const d = new Date(isoDate + "T12:00:00");
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= years;
}

export function SignupForm() {
  const fullNameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const passwordId = useId();
  const confirmId = useId();
  const dobId = useId();
  const cityId = useId();
  const heardId = useId();
  const termsId = useId();
  const marketingId = useId();

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("fullName") ?? "").trim();
    const email = String(fd.get("email") ?? "");
    const phone = String(fd.get("phone") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const confirm = String(fd.get("confirmPassword") ?? "");
    const dob = String(fd.get("dob") ?? "");
    const city = String(fd.get("city") ?? "").trim();
    const heard = String(fd.get("heard") ?? "");
    const intent = String(fd.get("intent") ?? "");
    const terms = fd.get("terms") === "on";

    if (fullName.length < 2) {
      setError("Enter your full name.");
      return;
    }
    if (!validEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (phone && !/^\+?[\d\s()-]{8,}$/.test(phone)) {
      setError("Enter a valid phone number, or leave it blank.");
      return;
    }
    // Single unified password rule: 10+ chars, one letter, one number
    const pIssues = passwordIssues(password);
    if (pIssues.length) {
      setError(`Password needs ${pIssues.join(", ")}.`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!dob) {
      setError("Date of birth is required (21+).");
      return;
    }
    if (!minAge(dob, 21)) {
      setError("You must be 21 or older to create an account.");
      return;
    }
    if (!intent) {
      setError("Choose how you plan to use Party Axis.");
      return;
    }
    if (!terms) {
      setError("Accept the terms and privacy policy to continue.");
      return;
    }
    if (city.length > 120) {
      setError("City or area is too long.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          full_name: fullName,
          phone: phone || null,
          city: city || null,
          heard: heard || null,
          intent,
          terms_accepted: terms,
          privacy_accepted: terms,
          rules_accepted: terms,
          age_21_plus: minAge(dob, 21),
        }),
      });
      const data: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(typeof data.error === "string" ? data.error : "Couldn't create account. Try again.");
        return;
      }
      router.replace("/publish");
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
        <label htmlFor={fullNameId} className="text-sm font-semibold text-[var(--text)]">
          Full name
        </label>
        <input
          id={fullNameId}
          name="fullName"
          type="text"
          autoComplete="name"
          required
          placeholder="As shown on your ID (for publisher verification later)"
          className="rounded-xl border border-[var(--border)] bg-[rgba(5,8,14,0.85)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan-soft)]"
        />
      </div>

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
        <label htmlFor={phoneId} className="text-sm font-semibold text-[var(--text)]">
          Mobile number <span className="font-normal text-[var(--muted)]">(optional)</span>
        </label>
        <input
          id={phoneId}
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+65 · SMS updates for events you follow"
          className="rounded-xl border border-[var(--border)] bg-[rgba(5,8,14,0.85)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan-soft)]"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={passwordId} className="text-sm font-semibold text-[var(--text)]">
            Password
          </label>
          <input
            id={passwordId}
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="10+ chars, letter & number"
            className="rounded-xl border border-[var(--border)] bg-[rgba(5,8,14,0.85)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan-soft)]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={confirmId} className="text-sm font-semibold text-[var(--text)]">
            Confirm password
          </label>
          <input
            id={confirmId}
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Repeat password"
            className="rounded-xl border border-[var(--border)] bg-[rgba(5,8,14,0.85)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan-soft)]"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={dobId} className="text-sm font-semibold text-[var(--text)]">
            Date of birth
          </label>
          <input
            id={dobId}
            name="dob"
            type="date"
            required
            className="rounded-xl border border-[var(--border)] bg-[rgba(5,8,14,0.85)] px-4 py-3 text-[var(--text)] focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan-soft)]"
          />
          <p className="text-xs text-[var(--muted)]">You must be 21+ to register (aligned with venue policies).</p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={cityId} className="text-sm font-semibold text-[var(--text)]">
            City / main area <span className="font-normal text-[var(--muted)]">(optional)</span>
          </label>
          <input
            id={cityId}
            name="city"
            type="text"
            autoComplete="address-level2"
            placeholder="e.g. Singapore · Tanjong Pagar"
            className="rounded-xl border border-[var(--border)] bg-[rgba(5,8,14,0.85)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan-soft)]"
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[rgba(5,8,14,0.45)] p-4">
        <legend className="px-1 text-sm font-semibold text-[var(--text)]">How will you use Party Axis?</legend>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--muted)]">
          <input type="radio" name="intent" value="attend" className="mt-1 size-4 text-[var(--cyan)] focus:ring-[var(--cyan)]" />
          <span>
            <span className="font-medium text-[var(--text)]">Discover &amp; attend</span> — save events, get reminders,
            weekly picks.
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--muted)]">
          <input type="radio" name="intent" value="promote" className="mt-1 size-4 text-[var(--cyan)] focus:ring-[var(--cyan)]" />
          <span>
            <span className="font-medium text-[var(--text)]">Promote venues or events</span> — publish listings, manage
            drafts.
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--muted)]">
          <input type="radio" name="intent" value="both" className="mt-1 size-4 text-[var(--cyan)] focus:ring-[var(--cyan)]" />
          <span>
            <span className="font-medium text-[var(--text)]">Both</span> — I attend and I run or promote events.
          </span>
        </label>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor={heardId} className="text-sm font-semibold text-[var(--text)]">
          How did you hear about us? <span className="font-normal text-[var(--muted)]">(optional)</span>
        </label>
        <select
          id={heardId}
          name="heard"
          className="rounded-xl border border-[var(--border)] bg-[rgba(5,8,14,0.85)] px-4 py-3 text-[var(--text)] focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan-soft)]"
          defaultValue=""
        >
          <option value="" disabled>
            Select…
          </option>
          <option value="search">Search / Google</option>
          <option value="social">Instagram, TikTok, or X</option>
          <option value="friend">Friend or promoter</option>
          <option value="venue">Venue or club</option>
          <option value="other">Other</option>
        </select>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--muted)]">
        <input
          id={termsId}
          name="terms"
          type="checkbox"
          required
          className="mt-1 size-4 shrink-0 rounded border-[var(--border)] bg-[rgba(5,8,14,0.85)] text-[var(--cyan)] focus:ring-[var(--cyan)]"
        />
        <span>
          I agree to the{" "}
          <a href="/terms" className="font-semibold text-[var(--cyan)] underline-offset-2 hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="font-semibold text-[var(--cyan)] underline-offset-2 hover:underline">
            Privacy
          </a>{" "}
          policy, and confirm the information above is accurate.
        </span>
      </label>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--muted)]">
        <input
          id={marketingId}
          name="marketing"
          type="checkbox"
          className="mt-1 size-4 shrink-0 rounded border-[var(--border)] bg-[rgba(5,8,14,0.85)] text-[var(--cyan)] focus:ring-[var(--cyan)]"
        />
        <span>
          Email me curated weekend highlights and partner offers.{" "}
          <span className="text-[var(--muted)]">Unsubscribe anytime.</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="pa-btn-primary mt-1 w-full rounded-full py-3.5 text-base font-extrabold text-[var(--surface)] no-underline disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-[var(--muted)]">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-[var(--cyan)] no-underline hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
