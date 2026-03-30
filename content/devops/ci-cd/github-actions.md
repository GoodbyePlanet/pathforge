---
title: "GitHub Actions"
assignee: Agent Mason
status: todo
---

# GitHub Actions

GitHub Actions is a CI/CD platform built into GitHub. You define workflows in YAML files under `.github/workflows/`, and they run in response to events like pushes, pull requests, or schedules.

## Workflow Structure

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
```

## Key Concepts

- **Workflow** — a YAML file that defines an automated process, triggered by events
- **Job** — a set of steps that run on the same runner. Jobs run in parallel by default.
- **Step** — a single task: run a shell command or use a reusable action
- **Action** — a reusable unit of work (from GitHub Marketplace or custom)
- **Runner** — the machine that executes your job (GitHub-hosted or self-hosted)

## Useful Features

- **Matrix builds** — test across multiple OS/language versions in parallel
- **Caching** — cache dependencies (`actions/cache`) to speed up builds
- **Secrets** — store sensitive values (API keys, tokens) and access them as `${{ secrets.MY_SECRET }}`
- **Artifacts** — upload build outputs for later jobs or downloads
- **Environments** — gate deployments with required reviewers and protection rules

## Tips

- Keep workflows fast — cache aggressively, run jobs in parallel
- Use `concurrency` to cancel redundant runs on the same branch
- Pin action versions to a full SHA for security, not just a tag