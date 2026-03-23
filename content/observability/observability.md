---
title: "Observability"
assignee: Nemanja Vasic
status: todo
---

# Observability

Observability is the ability to understand the internal state of a system by examining its external outputs — logs, metrics, and traces. In distributed systems like microservices, no single component holds the full picture, so observability becomes essential for debugging, performance tuning, and reliability.

## Core Pillars

- **[[distributed-tracing]]** — following a request across service boundaries
- **[[metrics]]** — numerical measurements of system behavior over time
- **[[structured-logging]]** — machine-readable logs tied to trace context

## Instrumentation & Tooling

- **[[opentelemetry]]** — the open standard for collecting telemetry data
- **[[dashboards-and-visualization]]** — turning raw telemetry into actionable views

## Why It Matters

Microservices trade monolith complexity for distributed complexity. When a request touches ten services, you need observability to answer "why is this slow?" or "where did this fail?" without guessing.