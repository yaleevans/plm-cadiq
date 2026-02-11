import type { TenantConfig, PlmConfig, CadIqConfig } from "$lib/types/config";

export interface ConfigRepo {
    getTenantConfig(tenantId: string): Promise<TenantConfig>;
    upsertTenantConfig(args: {
        tenantId: string;
        plm: PlmConfig | null;
        cadiq: CadIqConfig | null;
        updatedBy: string;
    }): Promise<void>;
}
