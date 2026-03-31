---
title: "Log Aggregation"
assignee: Nemanja Vasic
status: done
---

# Log Aggregation

Log aggregation means collecting logs from all services into a centralized system for searching and analysis.
Without it, debugging a single request means hunting through logs scattered across dozens of services and instances.

## Core Concepts

**Collection** — The OTel Collector replaces dedicated log shippers (Fluentd, Promtail)
with its `filelog`, `otlp`, and `syslog` receivers. The same Collector already handling your traces and metrics
now ingests logs too, giving you a single agent per host instead of three.

**Processing** — Before logs reach storage, the Collector's processor pipeline enriches, filters, and batches them.
The `resource` processor adds service name and environment to every log, while the `filter` processor drops noisy
entries before they reach storage. This is also where correlation happens — logs emitted through the OTel SDK
automatically carry `trace_id` and `span_id`, linking them directly to distributed traces.

**Routing & Storage** — The OTel Collector's exporter layer handles routing. You configure one or more exporters
(`otlphttp/loki`, `elasticsearch`, `awscloudwatchlogs`) in the Collector's pipeline section,
and the pipeline fans every processed log record out to all of them simultaneously. Because your application
only knows about OTel Collector, swapping or adding a backend is a Collector config change — your service
code never knows or cares where logs end up.

**Querying & Visualization** — With correlated `trace_id` fields embedded in every log line, dashboards in Grafana
or Kibana can jump from a log entry like `"payment failed"` straight to the distributed trace showing why
— no manual grep across services needed.

**Retention & Lifecycle** — Log storage grows fast, so backends enforce retention policies
(e.g., hot/warm/cold tiers in Elasticsearch, or compaction and retention periods in Loki).
The OTel Collector helps upstream by filtering out low-value logs and batching efficiently before they ever hit storage,
reducing volume at the source.

## Common Stacks

**ELK (Elasticsearch, Logstash, Kibana)** — Elasticsearch provides full-text search and indexing, Logstash handles
ingestion and transformation, and Kibana offers dashboards and querying via KQL. 

**Grafana Loki** — A log aggregation system inspired by Prometheus. Unlike Elasticsearch, Loki only indexes labels
(not full text), making it significantly cheaper to run.

**Cloud-Native Solutions** — AWS CloudWatch Logs, GCP Cloud Logging, and Azure Monitor Logs offer fully managed
aggregation with zero infrastructure overhead. Trade-off is vendor lock-in and potentially higher cost at scale.

**OTel Collector as the Common Thread** — Regardless of which backend you choose, the OTel Collector can sit in front
of all of them. This decouples your application instrumentation from the storage backend.