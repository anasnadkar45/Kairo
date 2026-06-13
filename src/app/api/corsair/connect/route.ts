import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { setupCorsair } from "corsair";
import { generateOAuthUrl } from "corsair/oauth";

import { corsair } from "~/server/corsair";
import { auth } from "~/server/better-auth";

const ALLOWED_PLUGINS = ["gmail", "googlecalendar"];

export async function GET(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const plugin = request.nextUrl.searchParams.get("plugin");

    if (!plugin || !ALLOWED_PLUGINS.includes(plugin)) {
        return NextResponse.json(
            { error: "Invalid plugin" },
            { status: 400 }
        );
    }

    const tenantId = session.user.id;

    // Creates corsair_accounts rows for this user if not already created
    await setupCorsair(corsair, {
        tenantId,
    });

    const redirectUri = `${process.env.APP_URL}/api/corsair/callback`;

    const { url, state } = await generateOAuthUrl(corsair, plugin, {
        tenantId,
        redirectUri,
    });

    console.log("Corsair OAuth redirectUri:", redirectUri);
    console.log("Corsair OAuth URL:", url);
    const response = NextResponse.redirect(url);

    response.cookies.set("corsair_oauth_state", state, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10,
        path: "/",
    });

    return response;
}