import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { getConfig, saveConfig } from "$lib/server/services/configService";

export const GET: RequestHandler = async ({ locals }) => {
    if (!locals.session) return json({ ok: false }, { status: 401 });
    const cfg = await getConfig(locals.session.tenantId);
    return json({ ok: true, config: cfg });
};

export const PUT: RequestHandler = async ({ locals, request }) => {
    if (!locals.session) return json({ ok: false }, { status: 401 });

    const body = await request.json();
    try {
        await saveConfig({
            tenantId: locals.session.tenantId,
            updatedBy: locals.session.userId,
            plm: body.plm ?? null,
            cadiq: body.cadiq ?? null
        });
        return json({ ok: true });
    } catch (e: any) {
        return json({ ok: false, error: e?.message ?? "Invalid config" }, { status: 400 });
    }
};
