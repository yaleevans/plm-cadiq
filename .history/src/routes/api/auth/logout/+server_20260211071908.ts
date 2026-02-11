import { json } from "@sveltejs/kit";
import { logout } from "$lib/server/services/authService";

export async function POST({ cookies }) {
    const sid = cookies.get("session");
    if (sid) await logout(sid);

    cookies.delete("session", { path: "/" });
    return json({ ok: true });
}
