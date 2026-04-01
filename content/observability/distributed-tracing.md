---
title: "Distributed Tracing"
assignee: Nemanja Vasic
status: done
---

# Distributed Tracing

Distributed tracing tracks a single request as it flows through multiple services. Each service adds a span —
a timed operation — and spans are linked together into a trace that shows the full request lifecycle.

## Key Topics

- **[[spans-and-trace-context]]** — anatomy of a trace and context propagation
- **[[sampling-strategies]]** — head-based vs tail-based sampling
- **[[service-maps]]** — visualizing service dependencies from traces

## Why It Matters

Logs tell you what happened in one service. Metrics tell you aggregates. Traces tell you what happened to a specific request across every service it touched — and where the time was spent.