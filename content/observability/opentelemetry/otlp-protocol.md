---
title: "OTLP Protocol"
assignee: Nemanja Vasic
status: in-progress
---

# OTLP Protocol

OpenTelemetry Protocol (OTLP) is the native wire protocol for transmitting telemetry data — traces, metrics, and logs
— between OTel SDKs, collectors, and backends. It supports both gRPC and HTTP/protobuf transports.

The full specification lives at [opentelemetry.io/docs/specs/otlp](https://opentelemetry.io/docs/specs/otlp/)

## Transport Options

OTLP defines following transport bindings:

**gRPC** — the default and most common transport. Uses HTTP/2 with Protocol Buffers serialization.
The default endpoint is `localhost:4317`.

**HTTP/protobuf** — uses standard HTTP/1.1 or HTTP/2 POST requests with protobuf-encoded bodies. Easier to work with
behind load balancers, proxies, and firewalls that don't support gRPC. The default endpoint is `localhost:4318`.
Request paths follow a convention: `/v1/traces`, `/v1/metrics`, and `/v1/logs`.

**HTTP/JSON** — technically supported but not recommended for production.

Both gRPC and HTTP transports carry the same protobuf-defined data model — the transport is just the delivery
mechanism. You can switch between them without changing your instrumentation code.

## Data Model

OTLP organizes telemetry into three signal types, each with its own protobuf message structure:

- **Traces** — `ResourceSpans` → `ScopeSpans` → `Span`. Each span has a trace ID, span ID, parent span ID, name,
  status, attributes, and events.
- **Metrics** — `ResourceMetrics` → `ScopeMetrics` → `Metric`. Supports gauge, sum, histogram, exponential histogram,
  and summary data points.
- **Logs** — `ResourceLogs` → `ScopeLogs` → `LogRecord`. Each record has a timestamp, severity, body, and attributes.

All three follow the same nesting pattern: **Resource → Scope → Data**.

**Resource** — identifies what is producing the telemetry. This is typically a service, described by attributes like 
service.name, service.version, host.name, deployment.environment. Every span/metric/log from the same service shares
the same Resource, so it's only sent once at the top of the hierarchy.

**Scope** (Instrumentation Scope) — identifies which library generated the data. For example, your app might use:
an HTTP instrumentation library that auto-creates spans for incoming requests
a database instrumentation library that creates spans for queries
your own manual instrumentation for custom business logic

**Data** — the actual telemetry records (spans, metrics, or log records).

```shell
  ResourceSpans
    Resource: { service.name: "order-service", service.version: "1.2.0" }
    ├── ScopeSpans
    │     Scope: { name: "@opentelemetry/instrumentation-http", version: "0.52.0" }
    │     ├── Span: "GET /orders"     - [2ms ——— 15ms]
    │     └── Span: "GET /orders/:id" - [20ms ——— 85ms] 
    └── ScopeSpans
          Scope: { name: "@opentelemetry/instrumentation-pg", version: "0.40.0" }
          ├── Span: "SELECT orders"        - [2ms ——— 15ms]
          └── Span: "SELECT order_items"   - [20ms ——— 85ms]
```