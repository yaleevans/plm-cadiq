import type { AuthRepo } from "./authRepo";
import { SqliteAuthRepo } from "./authRepo.sqlite";

let authRepo: AuthRepo | undefined;

export function getAuthRepo(): AuthRepo {
    if (authRepo) return authRepo;

    const provider = (process.env.DB_PROVIDER ?? "sqlite").toLowerCase();

    if (provider === "sqlite") {
        authRepo = new SqliteAuthRepo();
        return authRepo;
    }

    throw new Error(`Unsupported DB_PROVIDER: ${provider}`);
}
