import type { PlmConfig } from '$lib/types/config';
import type { PlmClient, LoginResult } from '../types';

type WindchillConfig = Extract<PlmConfig, { kind: 'windchill' }>;

export function createWindchillPlmClient(cfg: WindchillConfig): PlmClient {
    return {
        kind: 'windchill',
        async login(): Promise<LoginResult> {
            return { ok: false, message: 'Windchill not implemented yet' };
        },
        async ping(): Promise<boolean> {
            return false;
        },
        async search(term: string): Promise<any> {
            throw new Error('Windchill search not implemented');
        },
        async performSearchViewModel6(term: string): Promise<any> {
            throw new Error('Not applicable for Windchill');
        },
        async getItemRevisions(itemUid: string): Promise<any> {
            throw new Error('Not applicable for Windchill');
        },
        async getCadRefsForProPrt(uid: string): Promise<any> {
            throw new Error('Not applicable for Windchill');
        },
        async getDatasetsForRevision(itemRevUid: string): Promise<any> {
            throw new Error('Not applicable for Windchill');
        },
        async getDatasetRefList(datasetUid: string): Promise<any> {
            throw new Error('Not applicable for Windchill');
        }

    };
}
