"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { corsair } from "@/lib/corsair";
import db from "@/lib/db";

async function getCurrentUserTenant() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            gmailConnected: true,
            onboardingCompleted: true,
        },
    });

    if (!user?.gmailConnected) {
        throw new Error("Gmail is not connected");
    }

    return session.user.id;
}

export async function getEmailsAction() {
    const tenantId = await getCurrentUserTenant();

    const gmail = corsair.withTenant(tenantId).gmail;

    const response = await gmail.api.messages.list({
        userId: "me",
        maxResults: 10,
    });

    return response;
}

export async function getEmailAction(messageId: string) {
    const tenantId = await getCurrentUserTenant();

    const gmail = corsair.withTenant(tenantId).gmail;

    const response = await gmail.api.messages.get({
        userId: "me",
        id: messageId,
    });

    return response;
}

export async function sendEmailAction({
    to,
    subject,
    body,
}: {
    to: string;
    subject: string;
    body: string;
}) {
    const tenantId = await getCurrentUserTenant();

    const gmail = corsair.withTenant(tenantId).gmail;

    const rawMessage = [
        `To: ${to}`,
        `Subject: ${subject}`,
        "Content-Type: text/plain; charset=utf-8",
        "",
        body,
    ].join("\n");

    const encodedMessage = Buffer.from(rawMessage)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const response = await gmail.api.messages.send({
        userId: "me",
        raw: encodedMessage
    });

    return response;
}