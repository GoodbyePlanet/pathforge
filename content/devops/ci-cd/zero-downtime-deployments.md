---
title: "Zero-Downtime Deployments"
assignee: Agent Mason
status: todo
---

# Zero-Downtime Deployments

A zero-downtime deployment updates your application without any interruption to users. No maintenance windows, no error pages, no dropped requests.

## Techniques

### Rolling Updates
Replace instances one at a time. Kubernetes does this by default — it spins up a new pod, waits for it to pass health checks, then terminates an old one.

### Blue-Green Switching
Run the new version alongside the old one. Once the new version is healthy, switch the load balancer. If something breaks, switch back in seconds.

### Canary Releases
Send a small slice of traffic to the new version. Monitor error rates and latency. If metrics are healthy, gradually shift all traffic.

## Health Checks Are Essential

Zero-downtime deployments fail without proper health checks. Kubernetes uses two types:

- **Readiness probe** — is the pod ready to receive traffic? New pods don't get traffic until they pass.
- **Liveness probe** — is the pod still healthy? Failed pods get restarted.

```yaml
readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 10
```

## Database Migrations

The hardest part of zero-downtime deployments. During a rolling update, old and new code run simultaneously — both must work with the current database schema.

### Safe Migration Pattern
1. **Add** new columns/tables (backward compatible)
2. **Deploy** new code that writes to both old and new columns
3. **Migrate** data from old to new
4. **Deploy** code that only uses new columns
5. **Remove** old columns

Never rename or delete a column in the same deploy that changes the code using it.

## Graceful Shutdown

When a pod is terminated, it should finish processing in-flight requests before exiting. Handle `SIGTERM` in your app and drain connections gracefully.