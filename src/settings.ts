interface Settings {
  orgsToMerge?: string[];
  createdByToMerge: string[];
  token: string;
  maxAttempts: number;
}

function loadSettings() {
  const orgsToMergeText = process.env.MERGE_DEPENDABOT__ORGS_TO_MERGE;
  const orgsToMerge = orgsToMergeText?.split(",");

  const createdByToMergeText =
    process.env.MERGE_DEPENDABOT__CREATED_BY_TO_MERGE || "dependabot[bot]";
  const createdByToMerge = createdByToMergeText.split(",");

  const maxAttemptsText = process.env.MERGE_DEPENDABOT__MAX_ATTEMPTS || "1";
  let maxAttempts: number;
  try {
    maxAttempts = parseInt(maxAttemptsText);
  } catch (ex) {
    console.warn("Invalid value for maximum attempts. Defaulting to 1 attempt");
    maxAttempts = 1;
  }

  const token = process.env.MERGE_DEPENDABOT__TOKEN;
  if (!token) {
    throw new Error(
      "Missing API key. Please ensure MERGE_DEPENDABOT__TOKEN is set. https://github.com/settings/tokens"
    );
  }

  return {
    orgsToMerge,
    token,
    createdByToMerge,
    maxAttempts
  } as Settings;
}

export const settings = loadSettings();
