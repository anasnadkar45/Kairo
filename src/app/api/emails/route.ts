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
        { error: "Unauthorized", emails: [] },
        { status: 401 }
      );
    }

    // Better Auth user id is only used as Corsair tenant id
    const tenantCorsair = corsair.withTenant(session.user.id);

    // Gmail API userId should be "me", not session.user.id
    // const result = await tenantCorsair.gmail.api.threads.list({
    //   userId: "me",
    //   maxResults: 10,
    // });
    const result = await tenantCorsair.gmail.api.threads.list({
      userId: "me",
      maxResults: 10,
    });

    return NextResponse.json({
      emails: result?.threads ?? result?.threads ?? result ?? [],
    });
  } catch (error) {
    console.error("Get emails error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch emails. Make sure Gmail is connected.",
        emails: [],
      },
      { status: 500 }
    );
  }
}