import type { Metadata } from "next";
import Link from "next/link";

import { LegalPageShell } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Publisher guidelines",
  description: "How to submit strong listings on Party Axis, what moderators look for, and what gets rejected.",
};

export default function PublisherGuidelinesPage() {
  return (
    <LegalPageShell
      title="Publisher guidelines"
      description="Party Axis is a moderated board. These guidelines help your night go live faster, keep dancers safe, and protect promoters who play fair. They sit alongside our Terms and Privacy policy."
      lastUpdated="10 May 2026"
    >
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">1. How moderation works</h2>
        <p>
          Every submission is reviewed before it surfaces widely. We may approve as-is, ask for edits or proof, schedule for
          later, or decline. Similar listings in the past do not guarantee approval — risk, capacity, and neighbourhood
          context change.
        </p>
        <p>
          Moderation logs and decisions stay on record internally so the team can act consistently and respond if
          something is disputed.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">2. What to include for a clean pass</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-[var(--text)]">Exact venue and door policy</strong> — licensed trade name, level or
            entrance note, and the age rule that door staff enforce (18+ vs 21+ vs daytime all-ages).
          </li>
          <li>
            <strong className="text-[var(--text)]">Real start time</strong> — first set, warm-up, or doors; if the public
            face of the night starts later than doors, say so.
          </li>
          <li>
            <strong className="text-[var(--text)]">Honest lineup and billing</strong> — billed artists match contracts;
            “special guest” is fine if you do not imply someone who is not booked.
          </li>
          <li>
            <strong className="text-[var(--text)]">Ticket pointer</strong> — official resale, promoter link, or box-office
            instructions. No phishing or disguised URLs.
          </li>
          <li>
            <strong className="text-[var(--text)]">Accessibility and safety cues</strong> when relevant — stairs, strobe,
            volume, or bag policy if patrons need to plan ahead.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">3. Imagery, copy, and IP</h2>
        <p>
          Use artwork you control or have licensed. Do not crop third-party photographers without permission, and do not
          imply venue endorsement if the venue has not agreed. Logos for sponsors belong only when the deal permits that
          use.
        </p>
        <p>
          Keep claims factual — capacity, sell-out history, “official”, and charity tie-ins may be checked. Misleading
          pricing or hidden fees is grounds for rejection or removal.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">4. Sponsorships and paid placement</h2>
        <p>
          If money, alcohol, or contra changed hands for featuring a brand or venue, say so in the copy or moderator notes
          where disclosure is required. We may label partner rails separately from editorial picks.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">5. Hard nos</h2>
        <p>We will not carry listings that, in our judgement:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Promote illegal drugs, sexual services, hate, or violence.</li>
          <li>Use stolen artwork, impersonate another promoter or venue, or hide the true organiser.</li>
          <li>Target minors with adult nightlife or skirt liquor licensing.</li>
          <li>Spam the board with duplicates, fake RSVPs, or bait-and-switch venues.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">6. After you submit</h2>
        <p>
          Turnaround depends on volume and risk. If we pause a listing, reply to moderator email promptly with the
          requested details — delays on your side push the go-live date.
        </p>
        <p>
          Repeated violations or dishonest submissions can lead to account restrictions; severe abuse may be referred
          to platforms, venues, or authorities where appropriate.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">7. Related policies</h2>
        <p className="flex flex-wrap gap-x-4 gap-y-2">
          <Link className="font-semibold text-[var(--cyan)] no-underline hover:underline" href="/terms">
            Terms of service
          </Link>
          <Link className="font-semibold text-[var(--cyan)] no-underline hover:underline" href="/privacy">
            Privacy policy
          </Link>
        </p>
      </section>

      <section className="rounded-xl border border-[var(--cyan-soft)] bg-[rgba(0,212,232,0.06)] p-5 text-[var(--text)]">
        <h2 className="text-base font-bold text-[var(--text)]">Ready to list?</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          When your details match these guidelines, submissions move faster — start from the publish flow and drop any
          moderator context we should know up front.
        </p>
        <Link
          href="/publish"
          className="pa-btn-primary mt-4 inline-flex rounded-full px-8 py-3 text-sm font-extrabold text-[var(--surface)] no-underline"
        >
          Publish an ad
        </Link>
      </section>
    </LegalPageShell>
  );
}
