import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Party Axis collects, uses, and protects personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy policy"
      description="This policy describes how Party Axis collects, uses, shares, and protects personal information when you use our sites, forms, newsletters, and related services."
      lastUpdated="10 May 2026"
    >
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">1. Who we are</h2>
        <p>
          “Party Axis” refers to the independent listing and discovery project operating Party Axis branded websites and
          communications. Depending on how we are structured in your region, the data controller may be the legal entity named
          on invoice or contact channels when we make that explicit; until then, contact us via the channels we publish for
          support and publishers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">2. Information we collect</h2>
        <p>We may collect:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-[var(--text)]">Account and contact data</strong> — name, email, phone number, city or
            preferences you provide when you sign up, log in, publish, or contact us.
          </li>
          <li>
            <strong className="text-[var(--text)]">Publisher and listing data</strong> — event titles, venues, times,
            descriptions, media links, moderator notes, and verification artefacts you submit.
          </li>
          <li>
            <strong className="text-[var(--text)]">Newsletter and marketing preferences</strong> — email addresses and
            consent records when you opt in to Friday drops or similar updates.
          </li>
          <li>
            <strong className="text-[var(--text)]">Technical data</strong> — IP address, device and browser type,
            approximate location derived from IP, timestamps, and diagnostic logs needed to secure and operate the service.
          </li>
          <li>
            <strong className="text-[var(--text)]">Cookies and similar technologies</strong> — where we use them, they help
            with session integrity, preferences, and understanding aggregate traffic patterns.
          </li>
        </ul>
        <p>We ask you not to send sensitive categories of data (for example health data) unless we explicitly request them.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">3. How we use information</h2>
        <p>We use personal information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide, secure, and improve Party Axis — including moderation, anti-abuse, and fraud prevention.</li>
          <li>Process listings, surface discovery features, and communicate about submissions (approvals, questions, removals).</li>
          <li>Send newsletters and product updates when you have opted in or where we have another lawful basis.</li>
          <li>Comply with law, respond to lawful requests, and enforce our Terms of service.</li>
          <li>Analyse aggregated or de-identified trends to shape editorial and product direction.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">4. Lawful bases (Singapore &amp; general approach)</h2>
        <p>
          Where Singapore’s Personal Data Protection Act (PDPA) applies, we rely on appropriate bases such as consent
          (for marketing and some optional fields), performance of a contract or steps prior to contracting, legitimate
          interests balanced against your rights (for example security, analytics, and moderation in proportion), and legal
          obligation where required. In other regions, we align processing with applicable local law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">5. Sharing and processors</h2>
        <p>We may share information with:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-[var(--text)]">Service providers</strong> — hosting, email delivery, analytics, customer
            support tooling, and security vendors bound by confidentiality and processing terms.
          </li>
          <li>
            <strong className="text-[var(--text)]">Back-end integrations</strong> — when you use Party Axis with a linked API
            or legacy deployment, we may transmit necessary data to that environment to fulfil your request.
          </li>
          <li>
            <strong className="text-[var(--text)]">Authorities</strong> — when required by law or to protect rights, safety,
            and integrity of users and the public.
          </li>
          <li>
            <strong className="text-[var(--text)]">Business transfers</strong> — in connection with a merger, financing, or
            sale, subject to appropriate safeguards.
          </li>
        </ul>
        <p>We do not sell your personal information for money as that term is commonly understood in PDPA context.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">6. Retention</h2>
        <p>
          We keep information only as long as needed for the purposes above, including moderation logs, dispute resolution,
          and legal compliance. Listing content may remain in backups for a limited period after deletion. Aggregated
          analytics may persist in de-identified form.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">7. International transfers</h2>
        <p>
          Our providers may process data in Singapore and other countries. Where transfers require safeguards, we implement
          appropriate measures consistent with applicable law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">8. Your choices and rights</h2>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Access or correct personal data we hold about you.</li>
          <li>Withdraw marketing consent and unsubscribe from emails (link in every newsletter when applicable).</li>
          <li>Request deletion where retention is no longer required, subject to legal exceptions.</li>
          <li>Lodge a complaint with a supervisory authority where one applies.</li>
        </ul>
        <p>
          To exercise rights, contact us using published channels. We may need to verify your identity before processing
          requests.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">9. Children</h2>
        <p>
          Party Axis is not directed at children. Many listings involve nightlife and age-restricted venues. We do not
          knowingly collect personal information from children without parental authority where that concept applies.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">10. Security</h2>
        <p>
          We use reasonable administrative, technical, and physical safeguards designed to protect personal information. No
          online service is perfectly secure; please use strong passwords and report suspected compromise promptly.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">11. Changes to this policy</h2>
        <p>
          We may update this policy periodically. We will post the revised version and adjust the “Last updated” date. For
          material changes where consent is required, we will seek fresh consent or provide alternatives as the law
          requires.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--text)]">12. Contact</h2>
        <p>
          Privacy questions or requests: use the contact details we publish for Party Axis. If none appear yet, use the same
          path you would use for publishing support and mark the subject “Privacy”.
        </p>
        <p className="text-xs text-[var(--muted)]">
          This policy is drafted as a working template aligned with a Singapore-first service. It is not a substitute for
          legal advice tailored to your entity, data flows, and jurisdictions.
        </p>
      </section>
    </LegalPageShell>
  );
}
