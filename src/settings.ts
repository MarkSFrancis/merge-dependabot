const orgsToMergeText = process.env.MERGE_DEPENDABOT__ORGS_TO_MERGE;
export const orgsToMerge = orgsToMergeText?.split(",");

const createdByToMergeText = process.env.MERGE_DEPENDABOT__CREATED_BY_TO_MERGE || 'dependabot[bot]';
export const createdByToMerge = createdByToMergeText.split(",");

export const token = process.env.MERGE_DEPENDABOT__TOKEN;
if (!token) {
  throw new Error('Missing API key. Please ensure MERGE_DEPENDABOT__TOKEN is set. https://github.com/settings/tokens');
}
