import { getSqliteDb } from "$lib/server/db/sqlite";
import type { ConfigRepo } from "$lib/server/repos/configRepo";
import type { TenantConfig, PlmConfig, CadIqConfig } from "$lib/types/config";

export class SqliteConfigRepo implements ConfigRepo {
    private db = getSqliteDb();

    constructor() {
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS tenant_config (
        tenant_id TEXT PRIMARY KEY,
        plm_config_json TEXT,
        cadiq_config_json TEXT,
        updated_at INTEGER,
        updated_by TEXT
      );
    `);
    }

    async getTenantConfig(tenantId: string): Promise<TenantConfig> {
        const row = this.db
            .prepare(
                `SELECT tenant_id as tenantId, plm_config_json as plmJson, cadiq_config_json as cadiqJson,
                updated_at as updatedAt, updated_by as updatedBy
         FROM tenant_config
         WHERE tenant_id = ?`
            )
            .get(tenantId) as
            | { tenantId: string; plmJson: string | null; cadiqJson: string | null; updatedAt: number | null; updatedBy: string | null }
            | undefined;

        return {
            tenantId,
            plm: row?.plmJson ? (JSON.parse(row.plmJson) as PlmConfig) : null,
            cadiq: row?.cadiqJson ? (JSON.parse(row.cadiqJson) as CadIqConfig) : null,
            updatedAt: row?.updatedAt ?? null,
            updatedBy: row?.updatedBy ?? null
        };
    }

    async upsertTenantConfig(args: {
        tenantId: string;
        plm: PlmConfig | null;
        cadiq: CadIqConfig | null;
        updatedBy: string;
    }): Promise<void> {
        const now = Date.now();
        this.db
            .prepare(
                `INSERT INTO tenant_config (tenant_id, plm_config_json, cadiq_config_json, updated_at, updated_by)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(tenant_id) DO UPDATE SET
           plm_config_json=excluded.plm_config_json,
           cadiq_config_json=excluded.cadiq_config_json,
           updated_at=excluded.updated_at,
           updated_by=excluded.updated_by`
            )
            .run(
                args.tenantId,
                args.plm ? JSON.stringify(args.plm) : null,
                args.cadiq ? JSON.stringify(args.cadiq) : null,
                now,
                args.updatedBy
            );
    }
}
