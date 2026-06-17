import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { processOAuthCallback } from "corsair/oauth";
import { auth } from "@/lib/auth";
import { corsair } from "@/lib/corsair";
import db from "@/lib/db";

const APP_URL = process.env.BETTER_AUTH_URL;

function getPluginFromState(state: string) {
  try {
    const payload = state.split(".")[0];

    const decoded = Buffer.from(payload, "base64url").toString("utf-8");

    const parsed = JSON.parse(decoded);

    return parsed.plugin as string | undefined;
  } catch {
    return undefined;
  }
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", APP_URL!));
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/onboarding?oauth=failed", APP_URL!)
    );
  }

  const plugin = getPluginFromState(state);

  try {
    await processOAuthCallback(corsair, {
      code,
      state,
      redirectUri: `${APP_URL}/api/corsair/callback`,
    });

    if (plugin === "gmail") {
      await db.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          gmailConnected: true,
        },
      });

      return NextResponse.redirect(
        new URL("/onboarding?gmail=connected", APP_URL!)
      );
    }

    if (plugin === "googlecalendar") {
      await db.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          calendarConnected: true,
          onboardingCompleted: true,
        },
      });

      return NextResponse.redirect(
        new URL("/dashboard?calendar=connected", APP_URL!)
      );
    }

    return NextResponse.redirect(
      new URL("/onboarding?oauth=connected", APP_URL!)
    );
  } catch (error) {
    console.error("Corsair OAuth callback failed:", error);

    return NextResponse.redirect(
      new URL("/onboarding?oauth=failed", APP_URL!)
    );
  }
}