import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { corsair } from "~/server/corsair";
import { auth } from "~/server/better-auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", events: [] },
        { status: 401 }
      );
    }

    const tenantCorsair = corsair.withTenant(session.user.id);

    const result = await tenantCorsair.googlecalendar.api.events.getMany({
      calendarId: "primary",
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
      timeMin: new Date().toISOString(),
    });

    return NextResponse.json({
      events: result?.items ?? result?.items ?? result ?? [],
    });
  } catch (error) {
    console.error("Get calendar events error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch calendar events. Make sure Calendar is connected.",
        events: [],
      },
      { status: 500 }
    );
  }
}