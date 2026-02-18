// src/lib/plm/teamcenter/teamcenterPlmClient.ts
import type { PlmConfig } from '$lib/types/config';
import type { PlmClient, LoginResult } from '../types';
import { TcClient } from './tcClient';

type TeamcenterConfig = Extract<PlmConfig, { kind: 'teamcenter' }>;

export function createTeamcenterPlmClient(cfg: TeamcenterConfig): PlmClient {
    // IMPORTANT for Vite proxy mode:
    // If cfg.baseUrl is "http://helixcoredev01:8080" the browser will hit TC directly (CORS fails).
    // For dev proxy mode, cfg.baseUrl should be '' (empty string) so calls go to localhost:5173/tc/...
    // const tc = new TcClient(cfg.baseUrl);
    const tc = new TcClient('/tc', '/fsc'); // just for dev testing for now

    const client: PlmClient = {
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
            // Later: call a real “whoami”/session endpoint.
            return true;
        },

        async performSearchViewModel6(term: string): Promise<any> {
            return tc.performSearchViewModel6(term);

        },

        async search(term: string): Promise<any> {
            // nice wrapper (same as performSearchViewModel6 for now)
            return tc.performSearchViewModel6(term);
        },

        async getItemRevisions(itemUid: string) {
            return tc.getItemRevisions(itemUid);
        },

        async getCadRefsForProPrt(uid: string) {
            return tc.getRefList({ uid, type: 'ProPrt' });
        },

        async getDatasetsForRevision(itemRevUid: string) {
            return tc.getDatasetsForRevision(itemRevUid);
        },
        async getDatasetRefList(datasetUid: string) {
            return tc.getDatasetRefList(datasetUid);
        },



    };

    return client;
}
