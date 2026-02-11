import crypto from "node:crypto";
import { getSqliteDb } from "$lib/server/db/sqlite";
import type { JobRepo } from "$lib/server/repos/jobRepo";
import type { CadIqJob } from "$lib/server/types/jobs";

function newId() {
    return crypto.randomBytes(16).toString("hex");
}

export class SqliteJobRepo implements JobRepo {
    private db = getSqliteDb();

    constructor() {
        // ensure table exists
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS cadiq_jobs (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        created_by TEXT NOT NULL,
        name TEXT NOT NULL,
        status TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_jobs_tenant_created ON cadiq_jobs(tenant_id, created_at);
    `);
    }

    async listJobs(tenantId: string, limit: number): Promise<CadIqJob[]> {
        const rows = this.db
            .prepare(
                `SELECT id, tenant_id as tenantId, created_at as createdAt, created_by as createdBy, name, status
         FROM cadiq_jobs
         WHERE tenant_id = ?
         ORDER BY created_at DESC
         LIMIT ?`
            )
            .all(tenantId, limit) as CadIqJob[];

        return rows;
    }

    async createJob(args: { tenantId: string; createdBy: string; name: string }): Promise<CadIqJob> {
        const job: CadIqJob = {
            id: "job_" + newId(),
            tenantId: args.tenantId,
            createdAt: Date.now(),
            createdBy: args.createdBy,
            name: args.name,
            status: "queued"
        };

        this.db
            .prepare(
                `INSERT INTO cadiq_jobs (id, tenant_id, created_at, created_by, name, status)
         VALUES (?, ?, ?, ?, ?, ?)`
            )
            .run(job.id, job.tenantId, job.createdAt, job.createdBy, job.name, job.status);

        return job;
    }
}
