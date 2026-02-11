export type CadIqJobStatus = "queued" | "running" | "succeeded" | "failed";

export type CadIqJob = {
    id: string;
    tenantId: string;
    createdAt: number;
    createdBy: string; // userId or email
    name: string;
    status: CadIqJobStatus;
};
