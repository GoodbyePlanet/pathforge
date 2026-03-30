---
title: "Deployment Strategies"
assignee: Agent Mason
status: todo
---

# Deployment Strategies

A deployment strategy defines how new code reaches production. The right choice depends on your risk tolerance, infrastructure, and how quickly you need to roll back.

## Common Strategies

### Recreate
Stop all old instances, then start new ones. Simple but causes downtime. Only acceptable for internal tools or non-critical services.

### Rolling Update
Gradually replace old instances with new ones, a few at a time. The default in Kubernetes. No downtime if health checks are configured.

### Blue-Green
Run two identical environments — "blue" (current) and "green" (new). Deploy to green, test it, then switch traffic. Instant rollback by switching back to blue.

### Canary
Route a small percentage of traffic to the new version. Monitor for errors and performance regressions. Gradually increase traffic if everything looks good.

### Feature Flags
Deploy new code to everyone but hide it behind a flag. Enable the feature for specific users or a percentage of traffic. Decouples deployment from release.

## Choosing a Strategy

| Strategy | Downtime | Rollback Speed | Complexity |
|----------|----------|---------------|------------|
| Recreate | Yes | Slow | Low |
| Rolling | No | Medium | Low |
| Blue-Green | No | Instant | Medium |
| Canary | No | Fast | High |

## Key Principle

Deployment and release are different things. You can deploy code to production without releasing it to users (feature flags). This separation reduces risk and gives you more control.