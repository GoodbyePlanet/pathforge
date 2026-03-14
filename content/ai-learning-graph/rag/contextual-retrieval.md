---
assignee: John Doe
---

# Contextual Retrieval

Contextual retrieval is a technique that improves RAG accuracy by adding surrounding context
to each chunk before embedding it, so the retriever can find more relevant results.

## The Problem

Standard RAG splits documents into chunks and embeds them independently. But a chunk like
"He increased revenue by 40%" loses meaning without knowing who "he" is or which company is being discussed.

## How Contextual Retrieval Works

Before embedding, each chunk is enriched with context from the broader document — such as the document title,
section headers, or a brief summary of what the chunk is about. This gives the embedding model more signal
to work with.

## Benefits

- Significantly reduces retrieval errors caused by ambiguous or context-free chunks
- Pairs well with reranking for even better precision
- Relatively simple to implement compared to other retrieval improvements

TBD...