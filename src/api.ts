import { Octokit } from "@octokit/core";
import { token } from './settings';

const octokit = new Octokit({
  auth: token,
});

export function api<T>(method: string, url: string) {
  return octokit.request<T>({ method, url });
}
