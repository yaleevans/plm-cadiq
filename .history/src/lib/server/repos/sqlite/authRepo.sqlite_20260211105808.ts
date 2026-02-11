import crypto from "node:crypto";
import type { AuthRepo } from "$lib/server/repos/authRepo";
import type { Session, Tenant, User } from "$lib/server/types/auth";
import { getSqliteDb } from "$lib/server/db/sqlite";

function newId(bytes = 16) {
    return crypto.randomBytes(bytes).toString("hex");
}

export class SqliteAuthRepo implements AuthRepo {
    private db = getSqliteDb();
    private now = Date.now();

    async findUserByEmail(email: string): Promise<{ user: User; passwordHash: string } | null> {
        const row = this.db
            .prepare(
                `SELECT id, email, password_hash AS passwordHash
         FROM users
         WHERE email = ?`
            )
            .get(email.toLowerCase()) as { id: string; email: string; passwordHash: string } | undefined;

        if (!row) return null;

        return {
            user: { id: row.id, email: row.email },
            passwordHash: row.passwordHash
        };
    }

    async listTenantsForUser(userId: string): Promise<Tenant[]> {
        const rows = this.db
            .prepare(
                `SELECT t.id, t.name
         FROM memberships m
         JOIN tenants t ON t.id = m.tenant_id
         WHERE m.user_id = ?
         ORDER BY t.name`
            )
            .all(userId) as Tenant[];

        return rows;
    }

    async createUserWithTenant(args: {
        email: string;
        passwordHash: string;
        tenantName: string;
    }): Promise<{ userId: string; tenantId: string }> {
        const now = Date.now();
        const email = args.email.toLowerCase();

        // Tenant upsert
        let tenant = this.db
            .prepare(`SELECT id, name FROM tenants WHERE name = ?`)
            .get(args.tenantName) as { id: string; name: string } | undefined;

        if (!tenant) {
            tenant = { id: "t_" + newId(), name: args.tenantName };
            this.db.prepare(`INSERT INTO tenants (id, name) VALUES (?, ?)`).run(tenant.id, tenant.name);
        }

        const userId = "u_" + newId();
        this.db
            .prepare(`INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)`)
            .run(userId, email, args.passwordHash, this.now);


        this.db
            .prepare(`INSERT INTO memberships (user_id, tenant_id, role) VALUES (?, ?, 'admin')`)
            .run(userId, tenant.id);

        return { userId, tenantId: tenant.id };
    }

    async createSession(args: { userId: string; tenantId: string; ttlHours: number }): Promise<Session> {
        const now = Date.now();
        const expiresAt = now + args.ttlHours * 60 * 60 * 1000;
        const id = crypto.randomBytes(24).toString("hex");

        this.db
            .prepare(
                `INSERT INTO sessions (id, user_id, tenant_id, created_at, expires_at)
         VALUES (?, ?, ?, ?, ?)`
            )
            .run(id, args.userId, args.tenantId, now, expiresAt);

        // get email (so session is self-contained)
        const user = this.db
            .prepare(`SELECT email FROM users WHERE id = ?`)
            .get(args.userId) as { email: string } | undefined;

        const email = user?.email ?? "";

        return { id, userId: args.userId, tenantId: args.tenantId, email, expiresAt };
    }

    async getSession(sessionId: string): Promise<Session | null> {
        const row = this.db
            .prepare(
                `SELECT s.id, s.user_id AS userId, s.tenant_id AS tenantId, s.expires_at AS expiresAt,
                u.email AS email
         FROM sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.id = ?`
            )
            .get(sessionId) as Session | undefined;

        if (!row) return null;

        if (row.expiresAt <= Date.now()) {
            await this.deleteSession(sessionId);
            return null;
        }

        return row;
    }

    async deleteSession(sessionId: string): Promise<void> {
        this.db.prepare(`DELETE FROM sessions WHERE id = ?`).run(sessionId);
    }

    async listUsersForTenant(tenantId: string) {
        const rows = this.db
            .prepare(
                `SELECT u.id as userId, u.email as email, m.role as role
       FROM memberships m
       JOIN users u ON u.id = m.user_id
       WHERE m.tenant_id = ?
       ORDER BY u.email`
            )
            .all(tenantId) as { userId: string; email: string; role: "admin" | "member" }[];

        return rows;
    }

    async createUserAndAddToTenant(args: {
        tenantId: string;
        email: string;
        passwordHash: string;
        role: "admin" | "member";
    }) {
        const email = args.email.toLowerCase().trim();

        // try find existing user
        const existing = this.db
            .prepare(`SELECT id FROM users WHERE email = ?`)
            .get(email) as { id: string } | undefined;

        const userId = existing?.id ?? ("u_" + newId());

        // create user if missing
        if (!existing) {
            const now = Date.now();

            this.db
                .prepare(`INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)`)
                .run(userId, email, args.passwordHash, now);

        }

        // upsert membership
        this.db
            .prepare(
                `INSERT INTO memberships (user_id, tenant_id, role)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, tenant_id) DO UPDATE SET role=excluded.role`
            )
            .run(userId, args.tenantId, args.role);

        return { userId };
    }

    async setUserRole(args: { tenantId: string; userId: string; role: "admin" | "member" }) {
        this.db
            .prepare(`UPDATE memberships SET role = ? WHERE tenant_id = ? AND user_id = ?`)
            .run(args.role, args.tenantId, args.userId);
    }

    async removeUserFromTenant(args: { tenantId: string; userId: string }) {
        this.db
            .prepare(`DELETE FROM memberships WHERE tenant_id = ? AND user_id = ?`)
            .run(args.tenantId, args.userId);
    }

}
