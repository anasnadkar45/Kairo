"use client";

import { useState } from "react";
import { authClient } from "~/server/better-auth/client";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const {data:session} = authClient.useSession()
  console.log(session)

  async function setupWorkspace() {
    setLoading(true);

    const res = await fetch("/api/corsair/setup", {
      method: "POST",
    });

    setLoading(false);

    if (!res.ok) {
      alert("Workspace setup failed");
      return;
    }

    alert("Workspace setup complete");
  }

  function connectGmail() {
    window.location.href = "/api/corsair/connect?plugin=gmail";
  }

  function connectCalendar() {
    window.location.href = "/api/corsair/connect?plugin=googlecalendar";
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
      <div className="rounded-2xl border p-8">
        <h1 className="text-2xl font-bold">Setup InboxPilot</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Connect Gmail and Google Calendar to start managing your workflow.
        </p>

        <div className="mt-8 space-y-4">
          <div className="rounded-xl border p-4">
            <h2 className="font-semibold">1. Setup Workspace</h2>
            <p className="text-sm text-muted-foreground">
              Creates your Corsair tenant using your Better Auth user ID.
            </p>
            <button
              onClick={setupWorkspace}
              disabled={loading}
              className="mt-3 rounded-md bg-black px-4 py-2 text-white"
            >
              {loading ? "Setting up..." : "Setup Workspace"}
            </button>
          </div>

          <div className="rounded-xl border p-4">
            <h2 className="font-semibold">2. Connect Gmail</h2>
            <p className="text-sm text-muted-foreground">
              Allows the app to read and manage Gmail through Corsair.
            </p>
            <button
              onClick={connectGmail}
              className="mt-3 rounded-md bg-black px-4 py-2 text-white"
            >
              Connect Gmail
            </button>
          </div>

          <div className="rounded-xl border p-4">
            <h2 className="font-semibold">3. Connect Calendar</h2>
            <p className="text-sm text-muted-foreground">
              Allows the app to read and create Google Calendar events.
            </p>
            <button
              onClick={connectCalendar}
              className="mt-3 rounded-md bg-black px-4 py-2 text-white"
            >
              Connect Calendar
            </button>
          </div>

          <a
            href="/dashboard"
            className="block rounded-md bg-green-600 px-4 py-3 text-center text-white"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}