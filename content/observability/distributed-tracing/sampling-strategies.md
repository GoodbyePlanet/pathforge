---
title: "Sampling Strategies"
assignee: Nemanja Vasic
status: todo
---

# Sampling Strategies

At high throughput, tracing every request is impractical. Sampling strategies decide which traces to keep. Head-based sampling decides at the start of a request (simple but blind to outcome). Tail-based sampling decides after the request completes (captures errors and slow requests but requires buffering).