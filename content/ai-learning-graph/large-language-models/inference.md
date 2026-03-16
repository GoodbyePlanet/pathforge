---
title: "Inference"
assignee: Pero Zdero
status: todo
---

# Inference

An inference call is the act of sending input to a trained model and getting a response back.
It's the "using" phase of a model — as opposed to training, which is the "learning" phase.

## What Happens During Inference

1. Your input text is tokenized into tokens
2. Tokens are converted to embeddings (vectors)
3. The model processes these through its layers
4. Output tokens are generated one at a time (autoregressive decoding)
5. Tokens are decoded back into text

## Why It Matters

Every API call to an LLM is an inference call. Understanding inference helps you reason about:
- **Latency** — why responses take time (token-by-token generation)
- **Cost** — you pay per token processed and generated
- **Throughput** — how many requests a model can handle

## Inference vs Training

**Training** = adjusting model weights on data (expensive, done once or rarely).
**Inference** = running the trained model on new inputs (cheaper per call, done millions of times).

TBD...