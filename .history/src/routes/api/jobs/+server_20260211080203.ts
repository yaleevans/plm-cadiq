import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { getJobRepo } from "$lib/server/repos";

export const GET: RequestHandler = async ({ locals, url }) => {
    if (!locals.session) return json({ ok: false }, { status: 401 });

    const limit = Number(url.searchParams.get("limit") ?? "25");
    const jobs = await getJobRepo().listJobs(locals.session.tenantId, Math.min(limit, 100));

    return json({ ok: true, jobs });
};

export const POST: RequestHandler = async ({ locals, request }) => {
    if (!locals.session) return json({ ok: false }, { status: 401 });

    const { name } = await request.json();
    if (!name?.trim()) return json({ ok: false, error: "Missing name" }, { status: 400 });

    const job = await getJobRepo().createJob({
        tenantId: locals.session.tenantId,
        createdBy: locals.session.userId,
        name: name.trim()
    });

    return json({ ok: true, job });
};
