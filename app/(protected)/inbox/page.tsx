import { getEmailsAction } from "@/actions/gmail";
import { getCalendarEventsAction } from "@/actions/calendar";
import LogoutButton from "@/components/auth/logout-button";

export default async function DashboardPage() {
  const emails = await getEmailsAction();
  const events = await getCalendarEventsAction();

  return (
    <main className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <LogoutButton />
      </div>

      <section>
        <h2 className="text-lg font-medium">Recent Emails</h2>

        <pre className="mt-3 rounded-lg bg-neutral-100 p-4 text-xs overflow-auto">
          {JSON.stringify(emails, null, 2)}
        </pre>
      </section>

      <section>
        <h2 className="text-lg font-medium">Calendar Events</h2>

        <pre className="mt-3 rounded-lg bg-neutral-100 p-4 text-xs overflow-auto">
          {JSON.stringify(events, null, 2)}
        </pre>
      </section>
    </main>
  );
}