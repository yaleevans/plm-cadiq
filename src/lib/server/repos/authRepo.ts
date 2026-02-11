import type { Session, Tenant, User } from "$lib/server/types/auth";

export type TenantRole = "admin" | "member"; // keep this for now

export type TenantUser = {
    userId: string;
    email: string;
    role: TenantRole;
};

export interface AuthRepo {
    // Users
    findUserByEmail(email: string): Promise<{ user: User; passwordHash: string } | null>;
    listTenantsForUser(userId: string): Promise<Tenant[]>;

    // Optional: for local/dev provisioning
    createUserWithTenant(args: {
        email: string;
        passwordHash: string;
        tenantName: string;
    }): Promise<{ userId: string; tenantId: string }>;

    // Tenant user management
    listUsersForTenant(tenantId: string): Promise<TenantUser[]>;

    createUserAndAddToTenant(args: {
        tenantId: string;
        email: string;
        passwordHash: string;
        role: TenantRole;
    }): Promise<{ userId: string }>;

    setUserRole(args: { tenantId: string; userId: string; role: TenantRole }): Promise<void>;
    removeUserFromTenant(args: { tenantId: string; userId: string }): Promise<void>;

    // Sessions
    createSession(args: { userId: string; tenantId: string; ttlHours: number }): Promise<Session>;
    getSession(sessionId: string): Promise<Session | null>;
    deleteSession(sessionId: string): Promise<void>;
}
