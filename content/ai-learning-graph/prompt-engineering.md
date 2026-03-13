---
assignee: John Doe
---

# Prompt Engineering

Prompt engineering is the practice of designing inputs to language models to reliably elicit desired outputs. It bridges the gap between a model's raw capabilities and specific task requirements.

## Why It Matters

Language models are sensitive to how questions are framed. The same underlying capability can produce dramatically different results depending on prompt structure, examples, and instructions.

## Core Techniques

- **[[few-shot-learning]]** — providing examples in the prompt to guide behavior
- **[[chain-of-thought]]** — asking the model to reason step-by-step before answering

## Principles

**Be explicit** — models perform better with clear, specific instructions than vague ones.

**Control the format** — specify output structure (JSON, bullet points, etc.) when it matters.

**Iterate** — treat prompts like code. Version them, test them, and refine them based on failure cases.

## Limitations

Prompt engineering works around model limitations but doesn't fix them. A model that lacks knowledge or reasoning ability won't be rescued by clever prompting.