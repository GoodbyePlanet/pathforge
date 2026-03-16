---
title: "Context Window"
assignee: Pero Zdero
status: todo
---

# Context Window

The context window is the maximum number of tokens a language model can process in a single interaction —
including both input and output. It defines the model's "working memory" for a given request.

## The Problem

## Why It Matters

Everything the model knows during a conversation must fit in the context window. If your prompt, conversation history,
and desired response exceed the limit, older content gets truncated or the request fails.

## Typical Context Window Sizes

- GPT-3.5: 4K–16K tokens
- GPT-4: 8K–128K tokens
- Claude: 100K–200K tokens
- Gemini: up to 1M+ tokens

Larger context windows allow more information per request but increase cost and latency.

## Implications for Design

- Long documents may need chunking or summarization to fit
- Conversation history accumulates tokens over multiple turns
- Embeddings and RAG help work around context limits by retrieving only relevant information

TBD...

## Benefits