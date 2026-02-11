import type { AuthRepo } from "./authRepo";
import { SqliteAuthRepo } from "./sqlite/authRepo.sqlite";
import type { ConfigRepo } from "./configRepo";
import { SqliteConfigRepo } from "./sqlite/configRepo.sqlite";
import type { JobRepo } from "./jobRepo";
import { SqliteJobRepo } from "./sqlite/jobRepo.sqlite";

let authRepo: AuthRepo | undefined;
let jobRepo: JobRepo | undefined;
let configRepo: ConfigRepo | undefined;

export function getAuthRepo(): AuthRepo {
    if (authRepo) return authRepo;
    authRepo = new SqliteAuthRepo();
    return authRepo;
}

export function getJobRepo(): JobRepo {
    if (jobRepo) return jobRepo;
    jobRepo = new SqliteJobRepo();
    return jobRepo;
}

export function getConfigRepo(): ConfigRepo {
    if (configRepo) return configRepo;
    configRepo = new SqliteConfigRepo();
    return configRepo;
}
