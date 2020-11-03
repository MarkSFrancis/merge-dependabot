import { api } from "./api";
import { createdByToMerge } from "./settings";
import { includesIgnoreCase, waitFor } from "./utils";

export async function mergePrs(notifications) {
  let prs = await loadPrs(notifications.map(n => n.subject.url));

  if (prs.length === 0) {
    console.log('No outstanding PRs');
    return;
  }

  let taken10Minutes = false;
  const timer = setTimeout(() => (taken10Minutes = true), 1000 * 60 * 10);

  do {
    console.log(`Attempting to merge ${prs.length} PRs`);
  
    prs = await tryMergePrs(prs);
    
    if (mergeLater.length === 0 || taken10Minutes) {
      break;
    } else {
      console.log('Waiting for 5 minutes before retrying...', { outstandingPrs: mergeLater.map(l => l.url)});
      await waitFor(1000 * 60);
      console.log('Waiting for 4 minutes before retrying...');
      await waitFor(1000 * 60);
      console.log('Waiting for 3 minutes before retrying...');
      await waitFor(1000 * 60);
      console.log('Waiting for 2 minutes before retrying...');
      await waitFor(1000 * 60);
      console.log('Waiting for 1 minute before retrying...');
      await waitFor(1000 * 60);
      prs = await loadPrs(prs.map(pr => pr.url));
    }
  } while (true);

  clearTimeout(timer);

  if (taken10Minutes) {
    console.error(`Process timed out. ${mergeLater.length} PRs could not be merged`)
    process.exitCode = 1;  
  }
}

async function loadPrs(urls) {
  const prs = await Promise.all(
    urls.map(
      async (n) => (await api.request("GET " + n)).data
    )
  );

  return prs.filter(shouldMergePr);
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
