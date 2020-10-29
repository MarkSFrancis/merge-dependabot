# Merge Dependabot

Provides a CLI to allow dependabot PRs to be automatically merged.

Only merges if:

* The organisation is in `settings.js#orgsToMerge`
* The creator of the PR is in `settings.js#createdByToMerge`
* The notification for the PR is unread
* The PR is not waiting for a github action to pass
* The PR has no merge conflicts
