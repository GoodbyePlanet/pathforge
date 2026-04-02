---
title: "Sampling Strategies"
assignee: Nemanja Vasic
status: done
---

# Sampling Strategies

At high throughput, tracing every request is impractical. Sampling strategies decide which traces to keep while
controlling storage costs and maintaining visibility into important requests.

## Head-Based Sampling

Head-based sampling makes the keep-or-drop decision at the very start of a request,
before any spans are created. The decision propagates through all downstream services via trace context headers.
This means that if a request is sampled, it will be sampled in all downstream services.

- **Probabilistic sampling** — each trace has a fixed chance of being kept (e.g., 1 in 100).
Simple to implement but treats every request equally regardless of the outcome.
- **Rate-limiting sampling** — caps the number of traces collected per second (e.g., 10 traces/sec).

## Tail-Based Sampling

Tail-based sampling waits until the entire trace completes, then applies policies to decide whether to keep it.
This requires a collector layer that buffers spans in memory until the trace is complete.

Common policies:

- **Error sampling** — always keep traces that contain an error span.
- **Latency sampling** — keep traces where total duration exceeds a threshold (e.g., > 2s).
- **Status code sampling** — keep traces with specific HTTP status codes (e.g., 5xx).
- **Composite policies** — combine multiple rules (e.g., keep all errors AND 1% of healthy traffic).

## Adaptive / Dynamic Sampling

Adaptive sampling adjusts rates automatically based on traffic patterns. Instead of a static 1% rate,
the system increases sampling for low-volume endpoints and decreases it for high-volume ones.

## Priority / Always-On Sampling

Some traces should always be captured regardless of the sampling policy:

- Traces explicitly marked by application code (e.g., `span.setAttribute('sampling.priority', 1)`)
- Requests from specific users or tenants flagged for debugging

This is often implemented as a rule that runs before probabilistic sampling, forcing the keep decision.

## Putting It Together

In practice, production systems combine strategies. A common setup uses priority sampling to force capture of errors
and flagged requests, tail-based sampling to catch latency outliers, and probabilistic sampling to keep a small
percentage of normal traffic for reference. The right mix depends on traffic volume, storage budget,
and what questions you need your traces to answer.