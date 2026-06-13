"use client";

import { authClient } from "~/server/better-auth/client";


export default function LoginPage() {
  async function handleGoogleLogin() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/onboarding",
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button onClick={handleGoogleLogin}>
        Continue with Google
      </button>
    </main>
  );
}