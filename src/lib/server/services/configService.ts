import { getConfigRepo } from "$lib/server/repos";
import type { PlmConfig, CadIqConfig } from "$lib/types/config";

export async function getConfig(tenantId: string) {
    return getConfigRepo().getTenantConfig(tenantId);
}

export async function saveConfig(args: {
    tenantId: string;
    updatedBy: string;
    plm: PlmConfig | null;
    cadiq: CadIqConfig | null;
}) {
    // lightweight validation
    if (args.plm?.kind === "teamcenter" && !args.plm.baseUrl) throw new Error("PLM baseUrl required");
    if (args.cadiq && !args.cadiq.sharedInputPath) throw new Error("CadIQ sharedInputPath required");

    await getConfigRepo().upsertTenantConfig(args);
}
