import type { Metadata } from "next";
import Link from "next/link";

import { PublishAdForm } from "@/components/publish-ad-form";
import { PublishPageShell } from "@/components/publish-page-shell";

export const metadata: Metadata = {
  title: "Publish an ad",
  description:
    "Submit a party, venue night, or promoter listing to Party Axis for human moderation before it goes live.",
};

export default function PublishPage() {
  return (
    <PublishPageShell
      title="Publish an ad"
      description="Tell us what’s on. We route every submission through moderation so the board stays trustworthy — expect edits or follow-up questions for high-risk nights."
    >
      <p className="mb-6 text-sm leading-relaxed text-[var(--muted)]">
        New to the board? Read the{" "}
        <Link href="/publisher-guidelines" className="font-semibold text-[var(--cyan)] no-underline hover:underline">
          publisher guidelines
        </Link>{" "}
        first — it speeds up approval.
      </p>
      <PublishAdForm />
    </PublishPageShell>
  );
}
