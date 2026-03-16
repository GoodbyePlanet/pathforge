---
title: "Context Engineering"
assignee: Agent Mason
status: todo
---

# Context Engineering

Context engineering is the practice of deliberately designing what information a language model receives
in its context window — what goes in, what stays out, and in what order.

## The Problem

## Why It Matters

A model's output quality depends heavily on the context it receives. Prompt engineering focuses on
*how* you ask; context engineering focuses on *what information* the model has access to when answering.

## Key Considerations

- What background knowledge does the model need?
- What information is relevant vs distracting?
- How should information be ordered (models attend more to the beginning and end)?
- When should information be retrieved dynamically (RAG) vs included statically?
- How do you prevent context rot in long conversations?

## Techniques

- Selective inclusion of relevant documents and examples
- Summarizing long context before injection
- Structuring context with clear sections and labels
- Using retrieval to dynamically fetch what's needed
- Pruning outdated or irrelevant conversation history

TBD...

## Benefits