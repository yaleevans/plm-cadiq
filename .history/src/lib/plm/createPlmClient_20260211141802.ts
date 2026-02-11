import type { PlmConfig } from '$lib/types/config';
import type { PlmClient } from './types';

import { createTeamcenterPlmClient } from './teamcenter/teamcenterPlmClient';
import { createWindchillPlmClient } from './windchill/windchillPlmClient';

export function createPlmClient(cfg: PlmConfig): PlmClient {
    switch (cfg.kind) {
        case 'teamcenter':
            return createTeamcenterPlmClient(cfg);

        case 'windchill':
            return createWindchillPlmClient(cfg);

        default: {
            const _exhaustive: never = cfg;
            throw new Error(`Unsupported PLM kind`);
        }
    }
}
