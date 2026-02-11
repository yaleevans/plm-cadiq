export type PlmConfig =
    | {
        kind: "teamcenter";
        baseUrl: string;
        soasUrl?: string;
        username: string;
        password: string; // v1: store; later: encrypt/Secrets Manager
        defaultSearchRoot?: string;
    }
    | {
        kind: "windchill";
        baseUrl: string;
        username: string;
        password: string;
    };

export type CadIqConfig = {
    baseUrl: string;            // e.g. https://cadiq.company.local
    apiKey?: string;            // if applicable
    sharedInputPath: string;    // where job drops files / inputs
    sharedOutputPath: string;   // where results land
};

export type TenantConfig = {
    tenantId: string;
    plm: PlmConfig | null;
    cadiq: CadIqConfig | null;
    updatedAt: number | null;
    updatedBy: string | null;
};
