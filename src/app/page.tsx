"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [emails, setEmails] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadData() {
      const emailRes = await fetch("/api/emails");
      const emailData = await emailRes.json();

      const eventRes = await fetch("/api/calendar-events");
      const eventData = await eventRes.json();

      setEmails(emailData.emails ?? []);
      setEvents(eventData.events ?? []);
    }

    loadData();
  }, []);

  console.log(emails)
  console.log(events)
  return (
    <main className="grid min-h-screen grid-cols-[240px_1fr_360px]">
      <aside className="border-r p-4">
        <h1 className="font-bold">InboxPilot</h1>

        <nav className="mt-6 space-y-2">
          <p>Dashboard</p>
          <p>Inbox</p>
          <p>Calendar</p>
          <p>Settings</p>
        </nav>
      </aside>

      <section className="p-6">
        <h2 className="text-xl font-semibold">Emails</h2>

        {emails.map((email: any, index) => (
          <div key={email.id ?? index} className="rounded-lg border p-4">
            <p className="font-medium">
              {email.subject ?? email.id ?? "No subject"}
            </p>

            <p className="text-sm text-muted-foreground">
              {email.snippet ?? email.from ?? "No preview available"}
            </p>
          </div>
        ))}
      </section>

      <aside className="border-l p-6">
        <h2 className="text-xl font-semibold">Calendar</h2>

        {events.map((event: any, index) => (
          <div key={event.id ?? index} className="rounded-lg border p-4">
            <p className="font-medium">
              {event.summary ?? event.title ?? "Untitled event"}
            </p>

            <p className="text-sm text-muted-foreground">
              {event.start?.dateTime ?? event.start?.date ?? event.startTime ?? ""}
            </p>
          </div>
        ))}
      </aside>
    </main>
  );
}