import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {
    if (!locals.session) return json({ ok: false }, { status: 401 });
    return json({ ok: true, session: locals.session });
};
