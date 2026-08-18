# Versioning & Changelog

This project uses [Changesets](https://github.com/changesets/changesets) as the versioning tool. The version in `package.json` and the cumulative `CHANGELOG.md` are both managed automatically — you never edit them by hand.

## How it works

When a PR is merged into `main`, the CI pipeline:
1. Applies any pending changesets — bumping `package.json` version and appending to `CHANGELOG.md`
2. Commits the version bump and changelog back to `main`
3. Packages the built app as `dist.zip` and publishes it as a **GitHub pre-release** tagged `snapshot-{version}-{short-sha}`

You can browse all snapshots under the [Releases](https://github.com/FelipeZNascimento/bolao-vue/releases) tab.

## Deployment

### Snapshot (automatic)

Every push to `main` triggers the **Snapshot & Pre-release** workflow, which builds the app and publishes a pre-release to GitHub with `dist.zip` attached. No manual action required.

### Production (manual)

When you're ready to promote a snapshot to production:

1. Go to **Actions → 🚀 Deploy to PROD** on GitHub
2. Click **Run workflow**
3. Optionally enter a snapshot tag (e.g. `snapshot-1.2.0-abc1234`). Leave blank to deploy the **latest** snapshot automatically
4. Click **Run workflow**

The workflow will:
- Download `dist.zip` from the selected GitHub pre-release
- Deploy it to the production server via **SFTP**
- Promote the GitHub release from pre-release → **full release**

Required GitHub Secrets: `server`, `username`, `password`.

Dependencies are kept up-to-date automatically via **Dependabot** (weekly npm updates).
