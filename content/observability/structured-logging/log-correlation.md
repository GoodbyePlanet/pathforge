---
title: "Log Correlation"
assignee: Nemanja Vasic
status: done
---

# Log Correlation

Log correlation connects log entries to distributed traces by injecting `trace_id` and `span_id` into every log record.
This lets you jump from a trace span straight to the relevant logs.

## What Log Correlation Covers in Practice

- **Time of execution** — logs, traces, and metrics all record when execution happened (a moment or a range).
This is the most basic form of correlation — aligning signals on a shared timeline.
- **Trace context injection** — automatically attaching `trace_id` and `span_id` fields to log lines so they can be
grouped by request or transaction.
- **Cross-service correlation** — the same trace ID propagates across services, letting you filter logs from every
service involved in a single request.
- **Signal bridging** — linking logs to traces (and metrics) so you can pivot between them in your observability backend
(e.g., click a span in Grafana and see matching logs).
- **Context enrichment** — adding fields like `service.name`, `user.id`, or `request.path`
beyond trace/span IDs to make logs more searchable.