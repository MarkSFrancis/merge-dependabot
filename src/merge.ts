import { api } from "./api";
import { createdByToMerge } from "./settings";
import { Notifications, PR } from "./types";
import { includesIgnoreCase, waitFor } from "./utils";

export async function mergePrs(notifications: Notifications) {
  let prs = await loadPrs(notifications.map((n) => n.subject.url));

  if (prs.length === 0) {
    console.log("No outstanding PRs");
    return;
  }

  for (let attemptsCount = 0; attemptsCount < 3; attemptsCount++) {
    console.log(`Attempting to merge ${prs.length} PRs`);

    prs = await tryMergePrs(prs);

    if (prs.length === 0) {
      break;
    } else {
      if (prs.length > 0) {
        console.log(
          `Some PRs could not be merged`,
          prs.map((pr) => pr.url)
        );
      }

      console.log("Waiting for 5 minutes before retrying...");
      await waitFor(1000 * 60);
      console.log("4 minutes remaining...");
      await waitFor(1000 * 60);
      console.log("3 minutes remaining...");
      await waitFor(1000 * 60);
      console.log("2 minutes remaining...");
      await waitFor(1000 * 60);
      console.log("1 minute remaining...");
      await waitFor(1000 * 60);
      prs = await loadPrs(prs.map((pr) => pr.url));
    }
  }

  if (prs.length > 0) {
    console.error(
      `Maximum attempts reached. ${prs.length} PRs could not be merged`
    );
    process.exitCode = 1;
  }
}

async function loadPrs(urls: string[]) {
  const prs = await Promise.all(
    urls.map(async (n) => (await api<PR>("GET", n)).data)
  );

  return prs.filter(shouldMergePr);
}

async function tryMergePrs(prs: PR[]) {
  const mergeLater: PR[] = [];

  for (const pr of prs) {
    console.log(`Merging PR ${pr.url}`);

    if (!canMergePr(pr)) {
      console.error(`Can't merge PR (state: ${pr.mergeable_state})`);
      mergeLater.push(pr);
      continue;
    }

    if (!(await tryMergePr(pr))) {
      mergeLater.push(pr);
    }

    await waitFor(1000);
  }

  return mergeLater;
}

function shouldMergePr(pr: PR) {
  return (
    includesIgnoreCase(createdByToMerge, pr.user.login) && pr.state === "open"
  );
}

function canMergePr(pr: PR) {
  return pr.mergeable_state === "clean";
}

async function tryMergePr(pr: PR) {
  try {
    await api("PUT", `${pr.url}/merge`);
    console.log(`PR merged`);
    return true;
  } catch (ex) {
    console.error(`PR failed to merge`, ex);
    return false;
  }
}
