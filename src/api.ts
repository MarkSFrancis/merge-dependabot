import { Octokit } from "@octokit/core";
import { settings } from './settings.js';

const octokit = new Octokit({
  auth: settings.token,
});

export function api<T>(method: string, url: string) {
  return octokit.request<T>({ method, url });
}
