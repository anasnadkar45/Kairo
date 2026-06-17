import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { setupCorsair } from "corsair";
import { generateOAuthUrl } from "corsair/oauth";
import { auth } from "@/lib/auth";
import { corsair } from "@/lib/corsair";
import db from "@/lib/db";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL;

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", APP_URL!));
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceName: true,
      gmailConnected: true,
    },
  });

  if (!user?.workspaceName) {
    return NextResponse.redirect(new URL("/onboarding", APP_URL!));
  }

  if (!user.gmailConnected) {
    return NextResponse.redirect(new URL("/onboarding?step=gmail", APP_URL!));
  }

  const tenantId = session.user.id;
  const redirectUri = `${APP_URL}/api/corsair/callback`;

  await setupCorsair(corsair, {
    tenantId,
  });

  const { url } = await generateOAuthUrl(corsair, "googlecalendar", {
    tenantId,
    redirectUri,
  });

  return NextResponse.redirect(url);
}