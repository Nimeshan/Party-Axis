import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Terms governing use of Party Axis, listings, publisher conduct, and moderation.",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms of service"
      description="These terms govern access to Party Axis websites, apps, newsletters, and related services (“Party Axis”, “we”, “us”). By using our services, you agree to them. If you do not agree, do not use Party Axis."
      lastUpdated="10 May 2026"
    >
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">1. What Party Axis is</h2>
        <p>
          Party Axis operates an independent discovery and listing board focused on nightlife, venues, and related events,
          including in Singapore and nearby regions. We may surface community-submitted information, editorial highlights,
          and partner placements. We are not the organiser, venue operator, or ticket seller unless we say so explicitly
          in writing for a specific transaction.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">2. Eligibility and accounts</h2>
        <p>
          You must be able to form a binding contract where you live. Many listings involve alcohol and late nights: you
          may need to be 18 or 21 or older depending on venue rules and law. Publishers represent that they meet applicable
          age and authority requirements when they submit content.
        </p>
        <p>
          Account features may roll out over time. You are responsible for credentials and for activity under your
          account unless you notify us promptly of unauthorised use.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">3. Listings, ads, and publisher obligations</h2>
        <p>If you submit an event, flyer, venue night, or similar material (“Publisher Content”), you confirm that:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Information is materially accurate at the time submitted (time, location, age policy, pricing pointers).</li>
          <li>You have the rights and licences needed to use any images, logos, artist names, and copy you provide.</li>
          <li>You comply with laws that apply to you, including liquor, safety, consumer protection, and advertising rules.</li>
          <li>
            You will not impersonate others, conceal material sponsorships where disclosure is required, or upload
            malware and harmful code.
          </li>
        </ul>
        <p>
          Publisher Content is subject to moderation. We may edit formatting, delay publication, request proof, or refuse or
          remove listings at our discretion — including for risk, quality, or legal reasons — even if similar listings
          appeared before.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">4. Licence you grant us</h2>
        <p>
          You grant Party Axis a worldwide, non-exclusive, royalty-free licence to host, reproduce, adapt (for example for
          responsive layout and thumbnails), publicly display, and distribute Publisher Content for the purpose of
          operating, promoting, and improving Party Axis. You retain ownership of your content subject to this licence and
          may request removal as described in our Privacy policy where applicable.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">5. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use Party Axis to break the law, harass people, or discriminate unlawfully.</li>
          <li>Scrape or overload our systems, bypass access controls, or reverse engineer our service except where the law allows.</li>
          <li>Mislead users about risk (capacity, licences, artist appearance) or facilitate illegal drugs or violence.</li>
          <li>Collect personal data from users or publishers without lawful grounds and clear notice where required.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">6. Third parties, tickets, and venues</h2>
        <p>
          Links and integrations may take you to third-party sites, apps, or ticket sellers. Their terms and privacy
          policies apply there. Party Axis does not control door decisions, line-ups, refunds, or on-site safety. Attend at
          your own judgement.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">7. Disclaimers</h2>
        <p>
          Party Axis is provided “as is” and “as available”. To the fullest extent permitted by law, we disclaim warranties
          of merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee uninterrupted or
          error-free operation or that listings are complete or current.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">8. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, Party Axis and its team are not liable for indirect, incidental,
          special, consequential, or punitive damages, or for loss of profits, goodwill, or data, arising from your use of
          the services or reliance on listings. Our aggregate liability for claims relating to the services in any twelve
          month period is limited to the greater of (a) SGD 100 or (b) amounts you paid us for Party Axis paid features in
          that period (if any). Some jurisdictions do not allow certain exclusions; in those cases our liability is limited
          to the minimum allowable.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">9. Indemnity</h2>
        <p>
          You will defend and indemnify Party Axis against claims, damages, losses, and expenses (including reasonable legal
          fees) arising from your Publisher Content, your breach of these terms, or your misuse of the services, except to
          the extent caused by our wilful misconduct.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">10. Suspension and termination</h2>
        <p>
          We may suspend or terminate access if we reasonably believe you violated these terms or create risk or harm. You
          may stop using Party Axis at any time. Provisions that by nature should survive will survive termination.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">11. Changes</h2>
        <p>
          We may update these terms from time to time. We will post the new version here and adjust the “Last updated”
          date. Continued use after changes become effective constitutes acceptance unless the law requires additional steps.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">12. Governing law</h2>
        <p>
          Party Axis is operated with a Singapore-first lens. These terms are governed by the laws of Singapore, without
          regard to conflict-of-law rules. The courts of Singapore have non-exclusive jurisdiction, except that you or we
          may seek interim relief in any court with competent authority.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">13. Contact</h2>
        <p>
          Questions about these terms: use the contact path published on Party Axis (for example a listed email or
          publisher inbox) when available. If none is shown yet, reach out via the same channel you use for listings.
        </p>
        <p className="text-xs text-[var(--muted)]">
          This page is a practical template for a small independent board. Operators should have counsel review before
          relying on it for regulated or high-risk activities.
        </p>
      </section>
    </LegalPageShell>
  );
}
