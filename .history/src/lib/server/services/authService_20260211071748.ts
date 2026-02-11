import argon2 from "argon2";
import { getAuthRepo } from "$lib/server/repos";
import type { AuthResult, Session } from "$lib/server/types/auth";

export async function authenticate(email: string, password: string): Promise<AuthResult | null> {
    const repo = getAuthRepo();
    const found = await repo.findUserByEmail(email);

    if (!found) return null;

    const ok = await argon2.verify(found.passwordHash, password);
    if (!ok) return null;

    const tenants = await repo.listTenantsForUser(found.user.id);
    return { user: found.user, tenants };
}

export async function mintTenantSession(args: {
    email: string;
    password: string;
    tenantId: string;
}): Promise<{ session: Session } | null> {
    const auth = await authenticate(args.email, args.password);
    if (!auth) return null;

    const allowed = auth.tenants.some((t) => t.id === args.tenantId);
    if (!allowed) return null;

    const repo = getAuthRepo();
    const session = await repo.createSession({
        userId: auth.user.id,
        tenantId: args.tenantId,
        ttlHours: 8
    });

    return { session };
}

export async function getSession(sessionId: string) {
    return getAuthRepo().getSession(sessionId);
}

export async function logout(sessionId: string) {
    await getAuthRepo().deleteSession(sessionId);
}
