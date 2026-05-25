"use client";

import { Lock, LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: "/admin/photos",
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Login failed. Check the admin email and password.");
      return;
    }

    router.push(searchParams.get("callbackUrl") ?? "/admin/photos");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm rounded border border-line bg-white p-5 sm:p-6"
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded bg-austrian-red text-white">
        <Lock size={20} />
      </div>
      <p className="mono-label text-xs uppercase text-austrian-red">
        {"// admin clearance"}
      </p>
      <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
        Portfolio cockpit
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Sign in to upload photos and control what appears in the public gallery.
      </p>

      <div className="mt-7 space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Admin email"
          className="h-12 w-full rounded border border-line px-4 outline-none focus:border-austrian-red"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="h-12 w-full rounded border border-line px-4 outline-none focus:border-austrian-red"
        />
      </div>
      {error ? <p className="mt-4 text-sm text-austrian-red">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded bg-austrian-red font-semibold text-white transition hover:bg-austrian-red-dark disabled:opacity-60"
      >
        <LogIn size={18} />
        {isSubmitting ? "Checking..." : "Sign in"}
      </button>
    </form>
  );
}

export function LoginForm() {
  return (
    <Suspense>
      <LoginFormInner />
    </Suspense>
  );
}
