import Database from "better-sqlite3";

let _db: Database.Database | null = null;

export function getSqliteDb() {
  if (_db) return _db;

  _db = new Database("local.db");
  _db.pragma("journal_mode = WAL");
  _db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS memberships (
      user_id TEXT NOT NULL,
      tenant_id TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      PRIMARY KEY (user_id, tenant_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      tenant_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_tenant ON sessions(tenant_id);
    CREATE UNIQUE INDEX IF NOT EXISTS ux_memberships_user_tenant ON memberships(user_id, tenant_id);

  `);

  return _db;
}
