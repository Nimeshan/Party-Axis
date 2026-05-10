"use client";

import Link from "next/link";
import { useId, useState } from "react";

function validEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function validUrl(v: string) {
  const s = v.trim();
  if (!s) return true;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function PublishAdForm() {
  const idTitle = useId();
  const idVenue = useId();
  const idAddress = useId();
  const idCity = useId();
  const idStart = useId();
  const idEnd = useId();
  const idType = useId();
  const idBlurb = useId();
  const idDetails = useId();
  const idTicket = useId();
  const idImage = useId();
  const idOrg = useId();
  const idEmail = useId();
  const idPhone = useId();
  const idSocial = useId();
  const idAge = useId();
  const idNotes = useId();
  const cert21 = useId();
  const certRights = useId();
  const certLaw = useId();
  const certModeration = useId();

  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    const title = String(fd.get("title") ?? "").trim();
    const venue = String(fd.get("venue") ?? "").trim();
    const address = String(fd.get("address") ?? "").trim();
    const city = String(fd.get("city") ?? "").trim();
    const startLocal = String(fd.get("startLocal") ?? "");
    const blurb = String(fd.get("blurb") ?? "").trim();
    const organizer = String(fd.get("organizer") ?? "").trim();
    const email = String(fd.get("email") ?? "");
    const ticketUrl = String(fd.get("ticketUrl") ?? "");
    const imageUrl = String(fd.get("imageUrl") ?? "");

    if (title.length < 4) {
      setError("Event title is too short.");
      return;
    }
    if (venue.length < 2) {
      setError("Venue name is required.");
      return;
    }
    if (address.length < 6) {
      setError("Add a full address or detailed location patrons can find.");
      return;
    }
    if (city.length < 2) {
      setError("City or region is required.");
      return;
    }
    if (!startLocal) {
      setError("Start date and time are required.");
      return;
    }
    if (blurb.length < 24) {
      setError("Short description should be at least ~24 characters so the board has context.");
      return;
    }
    if (!validEmail(email)) {
      setError("Enter a valid contact email.");
      return;
    }
    if (organizer.length < 2) {
      setError("Organizer or promoter name is required.");
      return;
    }
    if (!validUrl(ticketUrl)) {
      setError("Ticket URL must be http(s), or leave it blank.");
      return;
    }
    if (!validUrl(imageUrl)) {
      setError("Image URL must be http(s), or leave it blank.");
      return;
    }

    const endLocal = String(fd.get("endLocal") ?? "");
    if (endLocal && endLocal <= startLocal) {
      setError("End time must be after start time.");
      return;
    }

    if (fd.get("cert21") !== "on" || fd.get("certRights") !== "on" || fd.get("certLaw") !== "on" || fd.get("certModeration") !== "on") {
      setError("Confirm all publisher checks to submit.");
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-xl border border-[var(--cyan-soft)] bg-[rgba(0,212,232,0.06)] px-4 py-5 text-sm leading-relaxed text-[var(--text)]">
        <p className="font-semibold text-[var(--ok)]">Submission received (preview)</p>
        <p className="mt-2 text-[var(--muted)]">
          Listing intake isn&apos;t connected to the live moderation queue yet. Nothing was sent to a server — wire this
          form to your API to route drafts for review.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link href="/" className="font-semibold text-[var(--cyan)] no-underline hover:underline">
            Back to home
          </Link>
          <button
            type="button"
            className="font-semibold text-[var(--muted)] underline-offset-4 hover:text-[var(--text)] hover:underline"
            onClick={() => setDone(false)}
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  const field =
    "rounded-xl border border-[var(--border)] bg-[rgba(5,8,14,0.85)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan-soft)]";
  const label = "text-sm font-semibold text-[var(--text)]";

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit} noValidate>
      {error ? (
        <p
          className="rounded-lg border border-[rgba(255,120,120,0.35)] bg-[rgba(80,20,20,0.35)] px-3 py-2 text-sm text-[#ffc9c9]"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor={idTitle} className={label}>
            Event title
          </label>
          <input
            id={idTitle}
            name="title"
            type="text"
            required
            placeholder="e.g. Axis Fridays · rooftop sunset"
            className={field}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={idVenue} className={label}>
            Venue name
          </label>
          <input id={idVenue} name="venue" type="text" required placeholder="Licensed venue or space" className={field} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={idCity} className={label}>
            City / area
          </label>
          <input id={idCity} name="city" type="text" required placeholder="Singapore · Clarke Quay" className={field} />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor={idAddress} className={label}>
            Address or find-me details
          </label>
          <textarea
            id={idAddress}
            name="address"
            required
            rows={2}
            placeholder="Street, level, landmark, or what door staff should expect"
            className={`${field} min-h-[4.5rem] resize-y`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={idStart} className={label}>
            Starts (local time)
          </label>
          <input id={idStart} name="startLocal" type="datetime-local" required className={field} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={idEnd} className={label}>
            Ends <span className="font-normal text-[var(--muted)]">(optional)</span>
          </label>
          <input id={idEnd} name="endLocal" type="datetime-local" className={field} />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor={idType} className={label}>
            Event type
          </label>
          <select id={idType} name="eventType" className={field} defaultValue="club">
            <option value="club">Club night / DJ</option>
            <option value="live">Live music</option>
            <option value="dayparty">Day party / pool</option>
            <option value="festival">Festival / multi-stage</option>
            <option value="culture">Culture / arts crossover</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor={idBlurb} className={label}>
            Short board description
          </label>
          <textarea
            id={idBlurb}
            name="blurb"
            required
            rows={3}
            placeholder="One tight paragraph: vibe, genre, door note, dress code if any."
            className={`${field} min-h-[5.5rem] resize-y`}
          />
          <p className="text-xs text-[var(--muted)]">Shown in listings — keep it factual and hype without deceptive claims.</p>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor={idDetails} className={label}>
            Full details <span className="font-normal text-[var(--muted)]">(optional)</span>
          </label>
          <textarea
            id={idDetails}
            name="details"
            rows={5}
            placeholder="Line-up, set times, ticket tiers, accessibility, refund policy pointers…"
            className={`${field} min-h-[8rem] resize-y`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={idTicket} className={label}>
            Ticket / RSVP link <span className="font-normal text-[var(--muted)]">(optional)</span>
          </label>
          <input id={idTicket} name="ticketUrl" type="url" placeholder="https://…" className={field} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={idImage} className={label}>
            Flyer image URL <span className="font-normal text-[var(--muted)]">(optional)</span>
          </label>
          <input id={idImage} name="imageUrl" type="url" placeholder="https://…jpg or png" className={field} />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2 rounded-xl border border-[var(--border)] bg-[rgba(5,8,14,0.45)] p-4">
          <p className={`${label} mb-1`}>Organizer &amp; contact</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor={idOrg} className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Promoter / org
              </label>
              <input id={idOrg} name="organizer" type="text" required className={field} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor={idEmail} className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Email
              </label>
              <input id={idEmail} name="email" type="email" autoComplete="email" required className={field} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor={idPhone} className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Phone <span className="font-normal normal-case text-[var(--muted)]">(optional)</span>
              </label>
              <input id={idPhone} name="phone" type="tel" autoComplete="tel" placeholder="+65 …" className={field} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor={idSocial} className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Instagram or link-in-bio <span className="font-normal normal-case text-[var(--muted)]">(optional)</span>
              </label>
              <input id={idSocial} name="social" type="text" placeholder="@handle or URL" className={field} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={idAge} className={label}>
            Age policy at door
          </label>
          <select id={idAge} name="agePolicy" className={field} defaultValue="21">
            <option value="18">18+</option>
            <option value="21">21+</option>
            <option value="all">All ages (family / daytime)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor={idNotes} className={label}>
            Notes for moderators <span className="font-normal text-[var(--muted)]">(optional)</span>
          </label>
          <textarea
            id={idNotes}
            name="modNotes"
            rows={2}
            placeholder="Licence #s, prior listings, special setup — not shown publicly."
            className={`${field} resize-y`}
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[rgba(5,8,14,0.35)] p-4">
        <legend className="px-1 text-sm font-semibold text-[var(--text)]">Publisher confirmations</legend>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--muted)]">
          <input id={cert21} name="cert21" type="checkbox" className="mt-1 size-4 shrink-0 rounded border-[var(--border)] accent-[var(--cyan)]" />
          <span>I am 21+ and authorized to promote this event.</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--muted)]">
          <input
            id={certRights}
            name="certRights"
            type="checkbox"
            className="mt-1 size-4 shrink-0 rounded border-[var(--border)] accent-[var(--cyan)]"
          />
          <span>I have rights to the artwork copy and do not infringe third-party trademarks or talent contracts.</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--muted)]">
          <input
            id={certLaw}
            name="certLaw"
            type="checkbox"
            className="mt-1 size-4 shrink-0 rounded border-[var(--border)] accent-[var(--cyan)]"
          />
          <span>This listing complies with applicable laws (including liquor, safety, and advertising rules).</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--muted)]">
          <input
            id={certModeration}
            name="certModeration"
            type="checkbox"
            className="mt-1 size-4 shrink-0 rounded border-[var(--border)] accent-[var(--cyan)]"
          />
          <span>
            I understand Party Axis moderates listings and may request edits, delay go-live, or reject submissions — per
            the{" "}
            <a href="/terms" className="font-semibold text-[var(--cyan)] underline-offset-2 hover:underline">
              Terms
            </a>
            .
          </span>
        </label>
      </fieldset>

      <button
        type="submit"
        className="pa-btn-primary w-full rounded-full py-3.5 text-base font-extrabold text-[var(--surface)] no-underline sm:w-auto sm:px-12"
      >
        Submit for review
      </button>

      <p className="text-center text-sm text-[var(--muted)] sm:text-left">
        Prefer to test accounts first?{" "}
        <Link href="/signup" className="font-semibold text-[var(--cyan)] no-underline hover:underline">
          Sign up
        </Link>{" "}
        — publisher tools will connect here later.
      </p>
    </form>
  );
}
