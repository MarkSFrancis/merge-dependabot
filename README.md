# Merge Dependabot

Provides a CLI to allow dependabot PRs to be automatically merged.

# What gets merged?

PRs are only merged if:

* There is an associated notification in your Github account
* The notification is unread
* The PR has passed all its build checks (such as passed all builds)
* The PR has no merge conflicts

# Usage

Prerequisites:
* A Personal access token for the CLI to use when accessing the GitHub API. Get yours [here](https://github.com/settings/tokens). It needs the following permissions: 
  * `notifications`
  * `repo`
* [NodeJS](https://nodejs.org/)
* Yarn (install with `npm i -g yarn`)

## Options

`.env` and `.env.default` are loaded on startup, and will overwrite any variables you have set. These files are a great place to store your settings.

Environment Variable Key | Required | Description
-- | -- | --
`MERGE_DEPENDABOT__TOKEN` | Yes | Personal access token for the CLI to use when accessing the GitHub API. Get yours [here](). It needs the following permissions: `notifications`, `repo`.
`MERGE_DEPENDABOT__ORGS_TO_MERGE` | No | A comma separated list of the organisations you want to automatically merge PRs for. If there are PRs to repositories in other organisations, the CLI will skip them
`MERGE_DEPENDABOT__CREATED_BY_TO_MERGE` | No | A comma separated list of the authors of PRs you want to automatically merge PRs from. If this is not set, it will default to `dependabot[bot]`

### Example options

```sh
MERGE_DEPENDABOT__TOKEN=secret_key
MERGE_DEPENDABOT__ORGS_TO_MERGE=marksfrancis
MERGE_DEPENDABOT__CREATED_BY_TO_MERGE=dependabot[bot],marksfrancis
```
