import type { PlmConfig } from '$lib/types/config';
import type { PlmClient, LoginResult } from '../types';
import { TcClient } from './tcClient';

type TeamcenterConfig = Extract<PlmConfig, { kind: 'teamcenter' }>;

export function createTeamcenterPlmClient(cfg: TeamcenterConfig): PlmClient {
    const tc = new TcClient(cfg.baseUrl);

    return {
        kind: 'teamcenter',

        async login(): Promise<LoginResult> {
            try {
                await tc.login(cfg.username, cfg.password);
                return { ok: true };
            } catch (e: any) {
                return { ok: false, message: e?.message ?? 'Teamcenter login failed' };
            }
        },

        async ping(): Promise<boolean> {
            try {
                // pick a safe endpoint later
                return true;
            } catch {
                return false;
            }
        }
    };
}
