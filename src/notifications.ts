import { api } from "./api";
import { mergePrs } from "./merge";
import { orgsToMerge, createdByToMerge } from "./settings";
import { Notifications } from "./types";
import { includesIgnoreCase } from "./utils";

export async function processNotifications() {
  if (orgsToMerge) {
    console.log("Only merging PRs for these organisations", orgsToMerge);
  }
  if (createdByToMerge) {
    console.log("Only merging PRs created by these users", createdByToMerge);
  }

  const response = await api<Notifications>("GET", "/notifications");
  const notifications = response.data.filter(shouldViewNotification);

  console.log(`Processing ${notifications.length} notifications`);

  await mergePrs(notifications);
}

function shouldViewNotification(notification: Notifications[0]) {
  if (notification.subject.type !== "PullRequest") return false;

  // Merge all orgs
  if (!orgsToMerge) return false;

  return includesIgnoreCase(orgsToMerge, notification.repository.owner.login);
}
