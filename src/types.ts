import { Endpoints } from "@octokit/types";

export type Notifications = Endpoints["GET /notifications"]["response"]["data"];
export type PR = Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}"]["response"]["data"]
