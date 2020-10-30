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

  if (prs.length === 0) {
    console.log('No outstanding PRs');
    return;
  }

  console.log(`Attempting to merge ${prs.length} PRs`);

  let mergeLater = [];
  let taken10Minutes = false;
  const timer = setTimeout(() => (taken10Minutes = true), 1000 * 60 * 10);

  do {
    mergeLater = await tryMergePrs(prs);
  } while (mergeLater.length > 0 || taken10Minutes);

  clearTimeout(timer);

  if (taken10Minutes) {
    console.error(`Process timed out. ${mergeLater.length} PRs could not be merged`)
    process.exitCode = 1;  
  }
}

async function tryMergePrs(prs) {
  const mergeLater = [];

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
  try {
    await api.request(`PUT ${pr.url}/merge`);
    console.log(`PR merged`);
    return true;
  } catch (ex) {
    console.error(`PR failed to merge`, ex);
    return false;
  }
}
