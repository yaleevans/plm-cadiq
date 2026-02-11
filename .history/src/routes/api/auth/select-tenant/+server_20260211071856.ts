import { json } from "@sveltejs/kit";
import { mintTenantSession } from "$lib/server/services/authService";

export async function POST({ request, cookies }) {
    const { email, password, tenantId } = await request.json();
    const minted = await mintTenantSession({ email, password, tenantId });

    if (!minted) return json({ ok: false, error: "Not allowed" }, { status: 403 });

    cookies.set("session", minted.session.id, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // set true behind HTTPS
        path: "/",
        maxAge: 60 * 60 * 8
    });

    return json({ ok: true });
}
