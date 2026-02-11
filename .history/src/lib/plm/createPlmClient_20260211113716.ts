import type { PlmClient, TenantPlmConfig } from './types';
import { createTeamcenterPlmClient } from './teamcenter/teamcenterPlmClient';

export function createPlmClient(cfg: TenantPlmConfig): PlmClient {
    switch (cfg.brand) {
        case 'teamcenter':
            return createTeamcenterPlmClient(cfg);
        default:
            throw new Error(`Unsupported PLM brand: ${(cfg as any).brand}`);
    }
}
