---
title: "OTel SDKs"
assignee: Nemanja Vasic
status: done
---

# OTel SDKs

OpenTelemetry SDKs are language-specific libraries that implement the OTel API and provide the machinery to create
spans, record metrics, and emit logs.
SDKs are available for most major languages including Java, Python, Go, JavaScript, .NET, and Rust.

## API vs SDK Split

OpenTelemetry separates the **API** from the **SDK**.

**API** — interface that defines _what_ you can do: create spans, record metrics, emit logs.

**SDK** — the concrete implementation that provides _how_ telemetry is collected, processed, and exported.
Application owners install the SDK and configure it with exporters, processors, and samplers.

This split means:
- Libraries depend only on the lightweight API — no heavy dependencies, no vendor lock-in.
- Applications pull in the SDK and wire everything together at startup.
- Swapping backends (e.g., Jaeger → Grafana Tempo) is a configuration change, not a code change.

```
┌─────────────────────────────────────────────────┐
│  Your Application                               │
│                                                  │
│   Application code ──► OTel API  ──► OTel SDK   │
│   Library code     ──► OTel API  ─┘              │
└─────────────────────────────────────────────────┘
```