# Branch Protection Rules

Recommended branch protection configuration for the default branch.

## Required Settings

### Status Checks

Enable **Require status checks to pass before merging** with these required checks:

| Check name              | Workflow   | Description                         |
|-------------------------|-----------|-------------------------------------|
| `Frontend — Build & Test` | `ci.yml`  | Angular typecheck, build, unit tests |
| `Backend — Build & Test`  | `ci.yml`  | .NET restore, build, test            |

### Pull Request Reviews

- **Require a pull request before merging** — enabled
- **Required approvals**: 1 (minimum)
- **Dismiss stale pull request approvals when new commits are pushed** — enabled
- **Require review from code owners** — optional (enable when `CODEOWNERS` is added)

### Branch Rules

- **Require branches to be up to date before merging** — enabled
- **Do not allow bypassing the above settings** — enabled for all contributors
- **Restrict who can push to matching branches** — limit direct pushes to release automation only

### Additional Recommendations

- **Require signed commits** — optional, recommended for production
- **Require linear history** — optional, keeps the commit graph clean (squash or rebase merges)
- **Include administrators** — enforce rules for all users including admins

## How to Apply

1. Go to **Settings > Branches** in the GitHub repository
2. Click **Add branch protection rule**
3. Set **Branch name pattern** to your default branch (e.g. `main` or `devin/1776997567-init-mro-platform`)
4. Configure the settings listed above
5. Click **Create** / **Save changes**
