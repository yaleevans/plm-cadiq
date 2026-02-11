import { json } from "@sveltejs/kit";
import { logout } from "$lib/server/services/authService";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies }) => {
    const sid = cookies.get("session");
    if (sid) await logout(sid);

    cookies.delete("session", { path: "/" });
    return json({ ok: true });
}
