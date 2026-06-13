import { NextRequest, NextResponse } from "next/server";

import { processOAuthCallback } from "corsair/oauth";
import { corsair } from "~/server/corsair";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${process.env.APP_URL}/onboarding?error=${error}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.APP_URL}/onboarding?error=missing_code_or_state`
    );
  }

  const storedState = request.cookies.get("corsair_oauth_state")?.value;

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(
      `${process.env.APP_URL}/onboarding?error=invalid_state`
    );
  }

  try {
    const result = await processOAuthCallback(corsair, {
      code,
      state,
      redirectUri: `${process.env.APP_URL}/api/corsair/callback`,
    });

    const response = NextResponse.redirect(
      `${process.env.APP_URL}/onboarding?connected=${result.plugin}`
    );

    response.cookies.delete("corsair_oauth_state");

    return response;
  } catch (error) {
    console.error("Corsair OAuth error:", error);

    const response = NextResponse.redirect(
      `${process.env.APP_URL}/onboarding?error=oauth_failed`
    );

    response.cookies.delete("corsair_oauth_state");

    return response;
  }
}