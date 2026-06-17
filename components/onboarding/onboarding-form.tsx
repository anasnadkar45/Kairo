"use client";

import { setupWorkspaceAction } from "@/actions/onboarding";


type OnboardingFormProps = {
  hasWorkspace: boolean;
  gmailConnected: boolean;
  calendarConnected: boolean;
};

export default function OnboardingForm({
  hasWorkspace,
  gmailConnected,
  calendarConnected,
}: OnboardingFormProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Setup your workspace</h1>

        <p className="mt-2 text-sm text-neutral-500">
          Create your workspace, connect Gmail, and connect Google Calendar.
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl border p-4">
            <h2 className="font-medium">1. Workspace setup</h2>

            {hasWorkspace ? (
              <p className="mt-2 text-sm text-green-600">
                Workspace setup completed.
              </p>
            ) : (
              <form action={setupWorkspaceAction} className="mt-4 space-y-3">
                <input
                  name="workspaceName"
                  placeholder="My Workspace"
                  className="w-full rounded-lg border px-3 py-2 outline-none"
                  required
                />

                <button className="w-full rounded-lg bg-black px-4 py-2 text-white">
                  Setup workspace
                </button>
              </form>
            )}
          </div>

          <div className="rounded-xl border p-4">
            <h2 className="font-medium">2. Connect Gmail</h2>

            {gmailConnected ? (
              <p className="mt-2 text-sm text-green-600">
                Gmail connected successfully.
              </p>
            ) : (
              <a
                href="/api/corsair/gmail/connect"
                className={`mt-4 block w-full rounded-lg px-4 py-2 text-center text-white ${
                  hasWorkspace
                    ? "bg-black"
                    : "pointer-events-none bg-neutral-400"
                }`}
              >
                Connect Gmail
              </a>
            )}
          </div>

          <div className="rounded-xl border p-4">
            <h2 className="font-medium">3. Connect Google Calendar</h2>

            {calendarConnected ? (
              <p className="mt-2 text-sm text-green-600">
                Google Calendar connected successfully.
              </p>
            ) : (
              <a
                href="/api/corsair/calendar/connect"
                className={`mt-4 block w-full rounded-lg px-4 py-2 text-center text-white ${
                  hasWorkspace && gmailConnected
                    ? "bg-black"
                    : "pointer-events-none bg-neutral-400"
                }`}
              >
                Connect Google Calendar
              </a>
            )}

            {!gmailConnected && (
              <p className="mt-2 text-xs text-neutral-500">
                Connect Gmail first before connecting Calendar.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}