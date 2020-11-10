import { api } from "./api";
import { mergePrs } from "./merge";
import { settings } from "./settings";
import { Notifications } from "./types";
import { includesIgnoreCase } from "./utils";

export async function processNotifications() {
  if (settings.orgsToMerge) {
    console.log(
      "Only merging PRs for these organisations",
      settings.orgsToMerge
    );
  }
  if (settings.createdByToMerge) {
    console.log(
      "Only merging PRs created by these users",
      settings.createdByToMerge
    );
  }

  const response = await api<Notifications>("GET", "/notifications");
  const prNotifications = response.data.filter(shouldViewNotification);

  await mergePrs(prNotifications);
}

function shouldViewNotification(notification: Notifications[0]) {
  if (notification.subject.type !== "PullRequest") return false;

  if (!settings.orgsToMerge) return true;

  return includesIgnoreCase(
    settings.orgsToMerge,
    notification.repository.owner.login
  );
}
