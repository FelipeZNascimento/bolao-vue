# How to Contribute

Never contributed to a project before? No problem — just follow these steps.

## Prerequisites

Make sure you have the following installed on your machine:
- [Git](https://git-scm.com/downloads)
- [Node.js 23.7.0](https://nodejs.org/) (or use a version manager — see the *Project Setup* section in the [README](README.md))
- [pnpm](https://pnpm.io/installation) — run `npm install -g pnpm` after installing Node

## 1. Clone the repository

```sh
git clone https://github.com/FelipeZNascimento/bolao-vue.git
cd bolao-vue
```

## 2. Install dependencies

```sh
pnpm install
```

## 3. Create a branch for your change

Pick a short, descriptive name for your branch ([how to name your branch](#branch-naming-convention)):

```sh
git checkout -b your-branch-name
```

## 4. Make your changes

Start the dev server to see your changes live:

```sh
pnpm run dev
```

Open `http://localhost:3000` in your browser. The page updates automatically as you edit files.

## 5. Lint and format your code

Before committing, make sure your code is clean:

```sh
pnpm run lint
pnpm run format
```

## 6. Add a changeset

This project uses [Changesets](https://github.com/changesets/changesets) to track versions and generate changelogs. Before opening a PR, describe your change:

```sh
pnpm changeset
```

You'll be prompted to choose the type of change (`patch`, `minor`, or `major`) and write a short description. This creates a small file in `.changeset/` that you commit alongside your code.

> If your change doesn't affect the app (e.g. a README update), skip this step and add the **`no-changeset`** label to your PR instead. The CI check will pass either way.

## 7. Commit your changes

Stage and commit all your files, including the changeset:

```sh
git add .
git commit -m "Short description of what you changed"
```

> Keep the message clear and in the present tense — e.g. `Fix indicator position on score component`, not `fixed stuff`.

## 8. Push your branch

```sh
git push origin your-branch-name
```

## 9. Open a Pull Request

1. Go to the [repository on GitHub](https://github.com/FelipeZNascimento/bolao-vue)
2. Click the **"Compare & pull request"** button that appears at the top
3. Write a short description of what your change does and why
4. Click **"Create pull request"**

A CI check will automatically verify that a changeset file is present (or the `no-changeset` label is set). Once approved, your PR can be merged. 🎉

---

## Branch Naming Convention

Use this format: `<type>/<trello_card_id>.<short-description>`

**Types:**
- `feat/` - New features
- `fix/` - Bug fixes
- `chore/` - Maintenance, refactoring, dependencies
- `docs/` - Documentation updates
- `test/` - Test changes

**Examples:**
```
feat/123.add-scoresheet
fix/456.reset-password-flow
chore/789.upgrade-primevue
docs/001.update-readme
```

## PR Naming Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <description>
```

**Examples:**
```
feat: add scoresheet component
fix: reset password flow now works
chore: upgrade Primevue to v4.5.5
docs: update installation instructions
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `chore` - Maintenance
- `docs` - Documentation
- `test` - Tests
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `ci` - CI/CD changes

Since we use **squash and merge**, your PR title becomes the commit message, so focus on making that clear.
