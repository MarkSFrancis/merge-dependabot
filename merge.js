import { api } from "./api";
import { createdByToMerge } from "./settings";
import { includesIgnoreCase, waitFor } from "./utils";

export async function mergePrs(notifications) {
  let prs = await Promise.all(
    notifications.map(
      async (n) => (await api.request("GET " + n.subject.url)).data
    )
  );

  prs = prs.filter(shouldMergePr);

  await tryMergePrs(prs);
}

async function tryMergePrs(prs) {
  const mergeLater = [];

  for (const pr of prs) {
    if (!canMergePr(pr)) {
      mergeLater.push(pr);
      continue;
    }

    if (!await tryMergePr(pr)) {
      mergeLater.push(pr);
    }
    waitFor(1000);
  }

  console.log(`${mergeLater.length} PRs waiting to be merged later`);
  return mergeLater;
}

function shouldMergePr(pr) {
  return (
    includesIgnoreCase(createdByToMerge, pr.user.login) && pr.state === "open"
  );
}

function canMergePr(pr) {
  return pr.mergeable_state === "clean";
}

async function tryMergePr(pr) {
  console.log(`Merging PR ${pr.url} (state: ${pr.mergeable_state})`);

  try {
    await api.request(`PUT ${pr.url}/merge`);
    console.log(`PR merged`);
    return true;
  } catch {
    return false;
  }
}
