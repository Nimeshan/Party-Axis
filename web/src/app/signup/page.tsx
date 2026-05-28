import type { Metadata } from "next";

import { AuthPageShell } from "@/components/auth-page-shell";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a Party Axis account to follow events, save listings, or publish as a promoter.",
};

export default function SignupPage() {
  return (
    <AuthPageShell
      title="Create your account"
      description="We ask for a few details so we can keep listings trustworthy, tailor recommendations, and stay in touch if you promote events."
    >
      <SignupForm />
    </AuthPageShell>
  );
}
