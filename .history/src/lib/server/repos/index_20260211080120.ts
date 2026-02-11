import type { AuthRepo } from "./authRepo";
import { SqliteAuthRepo } from "./sqlite/authRepo.sqlite";

import type { JobRepo } from "./jobRepo";
import { SqliteJobRepo } from "./sqlite/jobRepo.sqlite";

let authRepo: AuthRepo | undefined;
let jobRepo: JobRepo | undefined;

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
