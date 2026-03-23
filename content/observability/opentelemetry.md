---
title: "OpenTelemetry"
assignee: Nemanja Vasic
status: todo
---

# OpenTelemetry

OpenTelemetry (OTel) is a vendor-neutral open standard for collecting telemetry data — traces, metrics, and logs. It provides APIs, SDKs, and a collector that unify instrumentation across languages and backends.

## Key Topics

- **[[otlp-protocol]]** — the wire protocol for transmitting telemetry data
- **[[otel-collector]]** — collecting, processing, and exporting telemetry
- **[[otel-sdks]]** — instrumenting your code with OpenTelemetry SDKs
- **[[auto-instrumentation]]** — zero-code instrumentation for common frameworks

## Why OpenTelemetry

Before OTel, every observability vendor had its own instrumentation library. Switching backends meant re-instrumenting your code. OTel decouples instrumentation from the backend — instrument once, export anywhere.