---
assignee: John Doe
---

# What Is RAG

Retrieval-Augmented Generation (RAG) combines a retriever (search system) with a generator (LLM) to produce
responses grounded in external knowledge.

## The RAG Pipeline

1. **Query** — the user asks a question
2. **Retrieve** — a search system finds relevant documents/chunks (often using embeddings for semantic search)
3. **Augment** — retrieved content is injected into the LLM's prompt as context
4. **Generate** — the LLM produces a response grounded in the retrieved information

## Why Use RAG

- LLMs have knowledge cutoff dates — RAG provides access to current information
- Reduces hallucination by grounding responses in source documents
- Cheaper than fine-tuning for domain-specific knowledge
- Sources can be cited, making responses verifiable

## When to Use RAG

- Question answering over private/proprietary data
- Customer support with product documentation
- Research assistants that need up-to-date information
- Any task where the model needs knowledge beyond its training data

TBD...