---
title: "Types of LLMs"
assignee: Agent Mason
status: todo
---

# Types of LLMs

Not all language models are built the same. Different architectures and training approaches produce models
suited for different tasks. Understanding the landscape helps you pick the right model for each use case.

## The Problem

## Reasoning Models

Models specifically trained or prompted to perform step-by-step reasoning before answering.
Examples: OpenAI o1, o3, Claude with extended thinking, DeepSeek-R1.

## Non-Reasoning (General) Models

Standard LLMs that generate responses directly without explicit reasoning chains.
Faster and cheaper, suitable for straightforward tasks.
Examples: GPT-4o, Claude Sonnet, Gemini Flash.

## Specialised Models

Models fine-tuned or designed for specific domains — code generation, medical text, legal analysis,
mathematical reasoning, etc.
Examples: Codex, Med-PaLM, AlphaCode.

## Multimodal Models

Models that process and generate across multiple modalities — text, images, audio, video.
Examples: GPT-4o (text + image + audio), Gemini (text + image + audio + video), Claude (text + image).

## Use Cases — When to Use Which Type

- **Simple Q&A, classification, summarization** → general (non-reasoning) models; fast and cost-effective
- **Math, logic, multi-step planning** → reasoning models; accuracy justifies the extra latency and cost
- **Domain-specific tasks** → specialised models or fine-tuned variants for higher accuracy in that domain
- **Tasks involving images, audio, or video** → multimodal models
- **Code generation and debugging** → code-specialised or reasoning models
- **High-throughput, low-latency needs** → smaller, faster models (e.g., Haiku, Flash)

TBD...

## Benefits