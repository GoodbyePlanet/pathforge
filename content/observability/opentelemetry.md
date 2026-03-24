---
title: "OpenTelemetry"
assignee: Nemanja Vasic
status: done
---

# OpenTelemetry

OpenTelemetry (OTel) is open source, as well as vendor and tool agnostic open standard for generating, collecting,
managing, and exporting telemetry data — traces, metrics, and logs. It provides APIs, SDKs, and a collector that unify
instrumentation across languages and backends.
Vendor-agnostic means OpenTelemetry doesn't tie you to any specific observability backend. You instrument your code
once with OTel, and then you can send that telemetry data to any compatible backend — Jaeger, Grafana, Datadog,
New Relic, Honeycomb, Splunk...
these observability backends are systems that store, index, and let you query the telemetry data your application
produces.

Its goal is to enable easy instrumentation of your applications and systems, regardless of the programming language, 
infrastructure, and runtime environments used.

OTel specification is available at [opentelemetry.io](https://opentelemetry.io/docs/specs/otel).


## Key Topics

- **[[otlp-protocol]]** — the wire protocol for transmitting telemetry data
- **[[otel-collector]]** — collecting, processing, and exporting telemetry
- **[[otel-sdks]]** — instrumenting your code with OpenTelemetry SDKs
- **[[auto-instrumentation]]** — zero-code instrumentation for common frameworks

## Why OpenTelemetry

Before OTel, every observability vendor had its own instrumentation library. Switching backends meant re-instrumenting
your code. OTel decouples instrumentation from the backend — instrument once, export anywhere.