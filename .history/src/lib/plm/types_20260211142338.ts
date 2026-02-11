export type PlmBrand = 'teamcenter' | 'windchill' | 'enovia';

export type TeamcenterTenantConfig = {
    brand: 'teamcenter';
    baseUrl: string;          // "http://helixcoredev01:8080"
    username: string;
    password: string;
    soaUrl?: string;
    defaultSearchRoot?: string;
};

export type TenantPlmConfig = TeamcenterTenantConfig; // expand later with unions

export type LoginResult = { ok: true } | { ok: false; message: string };

export interface PlmClient {
    kind: 'teamcenter' | 'windchill'; // add 'enovia' later
    login(): Promise<LoginResult>;
    ping(): Promise<boolean>;
    // Add capabilities you actually need
}
