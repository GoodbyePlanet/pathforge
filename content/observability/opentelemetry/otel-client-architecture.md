---
title: "OTel Client Architecture"
assignee: Nemanja Vasic
status: done
---

# OTel Client Architecture

OpenTelemetry is a collection of APIs, SDKs, and tools for generating, collecting, and exporting telemetry data.
Its client architecture is designed around **signals**. Each signal represents specialized form of observability.
For example, traces, metrics, and logs are three separate signals.
They share a common subsystem – **context propagation** layer that carries correlation data (trace IDs) across
service boundaries. This means a single request can produce spans, metrics, and logs that are automatically
correlated.

## Context Propagation

Context propagation is the mechanism that ties all signals together. It allows trace IDs, span IDs, and baggage to
flow across function calls, threads, and service boundaries — so that telemetry emitted by different components can be
correlated into a single end-to-end picture.

## Tracing Signal

The tracing signal captures the **lifecycle of a request** as it flows through a system. The core unit is a **span** —
a named, timed operation that records what happened, how long it took, and whether it succeeded. Spans link together
into a **trace**, forming a tree that represents the full request path across services.

Each span carries:
- **Name** — describes the operation (e.g., `HTTP GET /users`, `db.query`).
- **Timestamps** — start and end time.
- **Attributes** — key-value metadata (e.g., `http.method=GET`, `db.system=postgresql`).
- **Status** — OK, Error, or Unset.
- **Events** — timestamped annotations within a span (e.g., an exception that was caught).
- **Links** — references to spans in other traces (useful for async workflows like queue consumers).

## Metric Signal

The metric signal captures **numerical measurements** over time — things like request count, latency distribution, or
CPU usage. Unlike traces (which record individual requests), metrics are designed for **aggregation**

OTel defines three core instrument types:

- **Counter** — an increasing value (e.g., total requests served, bytes sent).
- **Histogram** — records a distribution of values (e.g., request duration).
- **Gauge** — a point-in-time value that can go up or down (e.g., current memory usage, active connections).

Each measurement can carry **attributes** for dimensionality (e.g., `http.method=GET`, `status_code=200`).

## Log Signal

The log signal bridges **existing logging libraries** (Log4j, slog, Winston, etc.) with the OTel ecosystem. Rather
than replacing your logger, OTel provides a **Log Bridge API** that lets the SDK receive log records emitted by
these libraries, enrich them with trace context, and export them alongside traces and metrics.

Each log record contains:
- **Timestamp** — when the event occurred.
- **Severity** — level such as INFO, WARN, ERROR.
- **Body** — the log message itself.
- **Attributes** — structured key-value metadata.
- **Trace context** — the trace ID and span ID from the active context, automatically attached.

This automatic correlation is the key value: when you search for an error log in your backend, you can jump directly
to the trace that produced it — and vice versa.

## Baggage Signal

Baggage is a signal for propagating **arbitrary key-value pairs** across service boundaries alongside the trace
context. Unlike attributes on spans or metrics (which stay local to the signal that created them), baggage travels
to **every downstream service** in the call chain.