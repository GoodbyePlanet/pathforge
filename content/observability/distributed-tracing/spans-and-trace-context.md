---
title: "Spans and Traces and Context propagation"
assignee: Nemanja Vasic
status: done
---

## Spans

A span represents a single unit of work — an HTTP request, a database query, a function call.
Each span records a start time, duration, status, and attributes. Spans are linked via trace context
(a trace ID and parent span ID) propagated through HTTP headers, allowing you to reconstruct the full request path.

## Traces

A trace represents the complete journey of a request as it flows through a distributed system, captured as a tree of
connected spans that share a common trace ID. Each trace starts with a root span and branches into child spans
across services, revealing the full execution path, timing, and dependencies of that request.
See more on the official [OpenTelemetry documentation for traces](https://opentelemetry.io/docs/concepts/signals/traces/).

## Context propagation

Context Propagation is the core concept that enables Distributed Tracing. It is a mechanism that carries trace
identifiers (trace ID and span ID) across service boundaries by injecting them into carriers like HTTP headers 
and extracting them on the receiving side. This allows each service to link its spans to the same trace, preserving the
chain of a requests as it flows through the entire system.