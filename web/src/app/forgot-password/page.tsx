import type { Metadata } from "next";

import { AuthPageShell } from "@/components/auth-page-shell";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset your Party Axis account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      title="Reset your password"
      description="Enter the email you used for Party Axis. We’ll email a secure link — once account recovery is enabled on our servers."
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
