export type LoginResult = { ok: true } | { ok: false; message: string };

export interface PlmClient {
    kind: 'teamcenter' | 'windchill' | 'enovia';
    login(): Promise<LoginResult>;
    ping(): Promise<boolean>;

    // "search" is your nice wrapper; keep it
    search(term: string): Promise<any>;

    // keep this if you want the raw method exposed
    performSearchViewModel6(term: string): Promise<any>;

    getItemRevisions(itemUid: string): Promise<any>;

    getCadRefsForProPrt(uid: string): Promise<any>;

    getDatasetsForRevision(itemRevUid: string): Promise<any>;
    getDatasetRefList(datasetUid: string): Promise<any>;

}