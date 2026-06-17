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
            calendarConnected: true,
            onboardingCompleted: true,
        },
    });

    if (!user?.calendarConnected) {
        throw new Error("Google Calendar is not connected");
    }

    return session.user.id;
}

export async function getCalendarEventsAction() {
    const tenantId = await getCurrentUserTenant();

    const calendar = corsair.withTenant(tenantId).googlecalendar;

    const response = await calendar.api.events.getMany({
        calendarId: "primary",
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
    });

    return response;
}

export async function createCalendarEventAction({
    title,
    description,
    startTime,
    endTime,
}: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
}) {
    const tenantId = await getCurrentUserTenant();

    const calendar = corsair.withTenant(tenantId).googlecalendar;

    const response = await calendar.api.events.create({
        calendarId: "primary",
        event: {
            summary: title,
            description,
            start: {
                dateTime: startTime,
            },
            end: {
                dateTime: endTime,
            },
        }
    });

    return response;
}

export async function deleteCalendarEventAction(eventId: string) {
    const tenantId = await getCurrentUserTenant();

    const calendar = corsair.withTenant(tenantId).googlecalendar;

    const response = await calendar.api.events.delete({
        calendarId: "primary",
        id: eventId
    });

    return response;
}