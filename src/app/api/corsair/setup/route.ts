import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { setupCorsair } from "corsair";
import { corsair } from "~/server/corsair";
import { auth } from "~/server/better-auth";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenantId = session.user.id;

  const log = await setupCorsair(corsair, {
    tenantId,
  });

  return NextResponse.json({
    success: true,
    tenantId,
    log,
  });
}