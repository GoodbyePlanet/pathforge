---
title: "OTel Collector"
assignee: Nemanja Vasic
status: done
---

# OTel Collector

The OpenTelemetry Collector is a proxy that receives, processes, and exports telemetry data.
It sits between your instrumented services and your observability backend, handling batching, filtering, sampling,
and routing.

### Pipeline Architecture
Its pipeline architecture is built around core building blocks: 
- Receivers - collect telemetry data from various sources and formats
- Processors - transform, filter, and enrich telemetry data
- Exporters - send telemetry data to observability backends
- Connectors - connect two pipelines, acting as both exporter and receiver
- Extensions - provide additional capabilities like health checks

This design lets you decouple instrumentation from your choice of backend, making it easy to switch or fan out to
multiple vendors without changing application code.
The Collector can be deployed as an agent on each host or as a standalone gateway aggregating telemetry from many
services.

