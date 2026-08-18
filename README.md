# BolaoNFL

A **Vue 3 Progressive Web App (PWA)** for running an NFL betting pool that tracks the complete NFL season in real-time — including regular season, playoffs, and the Super Bowl.

## Features

- 🏈 Real-time match tracking and results
- 📊 Betting/prediction system with weekly bets
- 🏆 Rankings and leaderboards (weekly & season-long)
- ⭐ Extra bets (conference champions, Super Bowl winner, etc.)
- 📱 Installable PWA
- 🌙 Dark mode support
- 🔄 WebSocket-based live updates

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API + `<script setup>`) |
| Language | TypeScript |
| Build Tool | Vite |
| UI Library | PrimeVue (Aura theme preset) |
| Icons | FontAwesome |
| State Management | Pinia |
| Styling | SCSS |
| PWA | vite-plugin-pwa (Workbox) |
| Package Manager | pnpm |
| Node.js | 23.7.0 |

## Routes

| Path | Name | Description |
|---|---|---|
| `/` (alias `/resultados`) | Results | Match results and scores |
| `/apostar` | Bets | Place weekly predictions |
| `/extras` | Extras | Extra/season-long bets |

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_BOLAO_BASE_URL` | Backend REST API base URL |
| `VITE_BOLAO_WS_BASE_URL` | WebSocket server URL for live updates |

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur).

> TypeScript uses `vue-tsc` for type-checking `.vue` files. Volar makes the TS language service aware of Vue types inside the editor.

## Project Setup

### Node.js version

The required Node.js version is defined in `package.json` under `engines.node`.

**macOS / Linux** — install and switch with [nvm](https://github.com/nvm-sh/nvm):

```sh
# Install nvm (if you don't have it yet)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Restart your terminal, then install and use the correct Node version
nvm install 23.7.0
nvm use 23.7.0
```

Optionally, to switch automatically whenever you `cd` into this project, add this to your `~/.zshrc` or `~/.bashrc`:

```sh
load-nvmrc() {
  local node_version
  node_version=$(node --version 2>/dev/null)
  local pkg_version
  pkg_version=$(node -e "try{process.stdout.write(require('./package.json').engines?.node||'')}catch(e){}" 2>/dev/null)

  if [[ -n "$pkg_version" && "$node_version" != "v$pkg_version" ]]; then
    nvm use "$pkg_version"
  fi
}
autoload -U add-zsh-hook
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

This reads the version directly from `package.json` — keeping it as the single source of truth.

**Windows** — install [nvm-windows](https://github.com/coreybutler/nvm-windows) and run manually after entering the project:

```sh
nvm install 23.7.0
nvm use 23.7.0
```

> Auto-switching on `cd` is not supported on Windows PowerShell. If you use WSL or Git Bash, the macOS/Linux instructions above apply.


### Install dependencies

```sh
pnpm install
```

### Development (hot-reload)

```sh
pnpm run dev
```

Runs on `http://localhost:3000` by default.

### Type-Check, Compile and Minify for Production

```sh
pnpm run build
```

### Preview Production Build

```sh
pnpm run preview
```

### Run Unit Tests

```sh
pnpm run test:unit
```

### Lint

```sh
pnpm run lint
```

## How to Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for a step-by-step guide on setting up the project, making changes, and opening a pull request.

## Versioning & Deployment

See [VERSIONING.md](VERSIONING.md) for how versioning, changelogs, snapshots, and production deployments work.
