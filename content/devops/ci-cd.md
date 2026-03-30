---
title: "CI/CD"
assignee: Agent Mason
status: todo
---

# CI/CD

Continuous Integration (CI) and Continuous Delivery/Deployment (CD) automate the process of building, testing, and deploying software. CI merges code frequently and verifies it with automated tests. CD takes verified code and delivers it to staging or production automatically.

## Key Topics

- **[[github-actions]]** — GitHub's built-in CI/CD platform
- **[[pipeline-design]]** — structuring pipelines for speed and reliability
- **[[deployment-strategies]]** — choosing how to roll out changes
- **[[zero-downtime-deployments]]** — deploying without interrupting users

## CI — Continuous Integration

- Developers push code to a shared branch frequently (at least daily)
- Every push triggers an automated pipeline: build, lint, test
- Broken builds are fixed immediately — the main branch stays deployable
- The goal: catch integration bugs early, not in production

## CD — Continuous Delivery vs Deployment

- **Continuous Delivery** — every change that passes CI is *ready* to deploy, but a human triggers the release
- **Continuous Deployment** — every change that passes CI is *automatically* deployed to production

Most teams start with delivery and graduate to deployment as confidence in their test suite grows.

## Why CI/CD

Without automation, releases are manual, error-prone, and infrequent. CI/CD makes deployments boring — small, frequent changes with fast rollback, instead of risky big-bang releases.