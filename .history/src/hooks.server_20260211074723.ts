import type { Handle } from "@sveltejs/kit";
import { getSession } from "$lib/server/services/authService";

export const handle: Handle = async ({ event, resolve }) => {
    const sid = event.cookies.get("session");
    event.locals.session = sid ? await getSession(sid) : null;

    const isPublic =
        event.url.pathname.startsWith("/login") ||
        event.url.pathname.startsWith("/api/auth") ||
        event.url.pathname.startsWith("/api/dev");

    if (!isPublic && !event.locals.session) {
        return Response.redirect(new URL("/login", event.url), 303);
    }

    return resolve(event);
};
