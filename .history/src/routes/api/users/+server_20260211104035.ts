import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import argon2 from "argon2";
import { getAuthRepo } from "$lib/server/repos";

const normalizeRole = (role: unknown): "admin" | "user" => (role === "admin" ? "admin" : "user");

export const GET: RequestHandler = async ({ locals }) => {
    if (!locals.session) return json({ ok: false }, { status: 401 });

    const users = await getAuthRepo().listUsersForTenant(locals.session.tenantId);
    return json({ ok: true, users });
};

export const POST: RequestHandler = async ({ locals, request }) => {
    if (!locals.session) return json({ ok: false }, { status: 401 });

    const { email, tempPassword, role } = await request.json();

    if (!email || !tempPassword) {
        return json({ ok: false, error: "email and tempPassword are required" }, { status: 400 });
    }

    const passwordHash = await argon2.hash(String(tempPassword));

    await getAuthRepo().createUserAndAddToTenant({
        tenantId: locals.session.tenantId,
        email: String(email),
        passwordHash,
        role: normalizeRole(role)
    });

    return json({ ok: true });
};
