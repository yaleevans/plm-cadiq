import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import argon2 from "argon2";
import { getAuthRepo } from "$lib/server/repos";

export const POST: RequestHandler = async ({ request }) => {
    // Only allow in dev
    if (process.env.NODE_ENV === "production") {
        return json({ ok: false, error: "Not allowed" }, { status: 403 });
    }

    const { email, password, tenantName } = await request.json();

    if (!email || !password || !tenantName) {
        return json({ ok: false, error: "Missing email/password/tenantName" }, { status: 400 });
    }

    const repo = getAuthRepo();
    const passwordHash = await argon2.hash(password);

    const created = await repo.createUserWithTenant({
        email,
        passwordHash,
        tenantName
    });

    return json({ ok: true, ...created });
};
