import { api } from "./api";
import { mergePrs } from "./merge";
import { orgsToMerge } from "./settings";
import { includesIgnoreCase } from "./utils";

export async function processNotifications() {
  let notifications = await api.request("GET /notifications");
  notifications = notifications.data.filter(shouldViewNotification);

  console.log(`Processing ${notifications.length} notifications`);

  await mergePrs(notifications);
}

function shouldViewNotification(notification) {
  return notification.subject.type === "PullRequest" && 
    includesIgnoreCase(orgsToMerge, notification.repository.owner.login);
}
