import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <main className="photo-surface flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mono-label mb-6 inline-block text-xs uppercase text-muted hover:text-austrian-red"
        >
          back to portfolio
        </Link>
        <LoginForm />
      </div>
    </main>
  );
}
