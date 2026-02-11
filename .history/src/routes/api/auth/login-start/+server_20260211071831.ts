import { json } from "@sveltejs/kit";
import { authenticate } from "$lib/server/services/authService";

export async function POST({ request }) {
    const { email, password } = await request.json();
    const result = await authenticate(email, password);

    if (!result) return json({ ok: false, error: "Invalid login" }, { status: 401 });

    return json({ ok: true, ...result });
}
