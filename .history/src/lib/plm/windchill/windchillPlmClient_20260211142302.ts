import type { PlmClient, LoginResult } from '../types';
import type { PlmConfig } from '$lib/types/config';

type WindchillConfig = Extract<PlmConfig, { kind: 'windchill' }>;

/**
 * Windchill client (placeholder).
 * This compiles and plugs into the factory, but returns "not implemented yet".
 */
export function createWindchillPlmClient(cfg: WindchillConfig): PlmClient {
    return {
        kind: 'windchill',

        async login(): Promise<LoginResult> {
            // Later you’ll implement Windchill auth (likely form login + cookies or OAuth/SSO)
            return { ok: false, message: `Windchill not implemented yet (baseUrl=${cfg.baseUrl})` };
        },

        async ping(): Promise<boolean> {
            return false;
        }
    };
}
