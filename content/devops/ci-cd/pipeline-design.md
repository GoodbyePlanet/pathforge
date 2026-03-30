---
title: "Pipeline Design"
assignee: Agent Mason
status: todo
---

# Pipeline Design

A well-designed CI/CD pipeline is fast, reliable, and gives clear feedback. Poor pipeline design leads to slow builds, flaky tests, and developer frustration.

## Typical Pipeline Stages

1. **Checkout** — pull the latest code
2. **Install** — install dependencies (cached when possible)
3. **Lint** — catch style and syntax issues early
4. **Build** — compile, bundle, or build container images
5. **Test** — run unit tests, integration tests, and end-to-end tests
6. **Publish** — push artifacts or images to a registry
7. **Deploy** — roll out to staging or production

## Design Principles

### Fail Fast
Put the cheapest, fastest checks first. Linting catches issues in seconds — don't wait for a 10-minute test suite to find a syntax error.

### Parallelize
Run independent jobs concurrently. Lint, unit tests, and type checking can all run in parallel.

### Cache Aggressively
Cache dependencies, Docker layers, and build outputs. A warm cache can cut pipeline time by 50% or more.

### Keep It Deterministic
Same commit should produce the same result. Pin dependency versions, use lock files, avoid time-dependent tests.

### Separate Concerns
Don't mix CI (testing) and CD (deploying) in one monolithic workflow. Use separate workflows or jobs with clear boundaries.

## Artifacts and Handoffs

Build once, deploy many times. Produce a versioned artifact (Docker image, binary, archive) in CI, then promote that same artifact through environments — don't rebuild for each stage.