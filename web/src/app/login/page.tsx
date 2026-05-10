import type { Metadata } from "next";

import { AuthPageShell } from "@/components/auth-page-shell";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Party Axis for saved events, publisher tools, and updates.",
};

export default function LoginPage() {
  return (
    <AuthPageShell
      title="Welcome back"
      description="Log in with the email you used to sign up. Publisher tools and saved events will appear here when accounts are connected."
    >
      <LoginForm />
    </AuthPageShell>
  );
}
