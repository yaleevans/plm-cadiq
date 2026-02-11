import type { AuthResult, Session, Tenant, User } from "$lib/server/types/auth";

export interface AuthRepo {
    // Users
    findUserByEmail(email: string): Promise<{ user: User; passwordHash: string } | null>;
    listTenantsForUser(userId: string): Promise<Tenant[]>;

    // Optional: for local/dev provisioning
    createUserWithTenant(args: { email: string; passwordHash: string; tenantName: string }): Promise<{
        userId: string;
        tenantId: string;
    }>;

    // Sessions
    createSession(args: { userId: string; tenantId: string; ttlHours: number }): Promise<Session>;
    getSession(sessionId: string): Promise<Session | null>;
    deleteSession(sessionId: string): Promise<void>;
}
