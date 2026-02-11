import type { CadIqJob } from "$lib/server/types/jobs";

export interface JobRepo {
    listJobs(tenantId: string, limit: number): Promise<CadIqJob[]>;
    createJob(args: { tenantId: string; createdBy: string; name: string }): Promise<CadIqJob>;
}
