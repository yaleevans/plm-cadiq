import type { TenantConfig, PlmConfig, CadIqConfig } from "$lib/server/types/config";

export interface ConfigRepo {
    getTenantConfig(tenantId: string): Promise<TenantConfig>;
    upsertTenantConfig(args: {
        tenantId: string;
        plm: PlmConfig | null;
        cadiq: CadIqConfig | null;
        updatedBy: string;
    }): Promise<void>;
}
