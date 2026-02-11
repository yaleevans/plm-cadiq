import type { AuthRepo } from "./authRepo";
import { SqliteAuthRepo } from "./sqlite/authRepo.sqlite";

let _authRepo: AuthRepo | null = null;

export function getAuthRepo(): AuthRepo {
    if (_authRepo) return _authRepo;

    const provider = (process.env.DB_PROVIDER ?? "sqlite").toLowerCase();

    switch (provider) {
        case "sqlite":
            _authRepo = new SqliteAuthRepo();
            return _authRepo;

        // Later:
        // case "dynamo":
        //   _authRepo = new DynamoAuthRepo();
        //   return _authRepo;

        default:
            throw new Error(`Unsupported DB_PROVIDER: ${provider}`);
    }
}
