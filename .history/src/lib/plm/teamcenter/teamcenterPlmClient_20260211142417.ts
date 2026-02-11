import type { LoginResult, PlmClient, TeamcenterTenantConfig } from '$lib/plm/types';
import { TcClient } from './tcClient';

export function createTeamcenterPlmClient(cfg: TeamcenterTenantConfig): PlmClient {
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
                // Replace with a safe endpoint that returns 200 when logged in
                await tc.get('/tc/JsonRestServices/Core-2011-06-Session/refresh'); // example only
                return true;
            } catch {
                return false;
            }
        }
    };
}
