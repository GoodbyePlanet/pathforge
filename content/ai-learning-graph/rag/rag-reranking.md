---
title: "RAG Reranking"
assignee: Nemanja Vasic
status: done
---

## The problem

Most embedding models used to create embeddings are bi-encoders. Bi-encoders embed documents independently,
without knowing the user’s query. As a result, retrieval is fast, but important query-specific details may not
be emphasized in the embedding, which can reduce retrieval accuracy. When searching a vector database, this can cause
relevant documents to be ranked lower or missed entirely.

## RAG Reranking

To address this gap between fast retrieval and good accuracy, modern RAG systems introduce a reranking step,
where a smaller set of retrieved documents is re-evaluated using more accurate models that apply deeper,
query-aware reasoning.

RAG re-ranking is the process of re-ordering retrieved documents using a more accurate relevance model so the LLM
sees the best possible context. Let’s break it down.

There are two steps:

1. Retrieval: Is the process of finding relevant documents using, e.g., similarity search. This will return e.g. 50
possible candidate documents.

2. Re-ranking: Reranker will then take a user query into consideration and re-order (filter) most relevant documents.
(top N candidates)

### Types of reranking models:

**cross-encoder** - An AI model that receives an input in the form of data pair (query and document pair or two sentences)
and processes them together in a single pass*, producing a highly accurate relevance score. We use this score to reorder
retrieved documents by relevance to our query.

**LLM-based re-ranking** - The LLM (like GPT 5.1) itself scores or orders documents.

**Hybrid / metadata-aware re-ranking** - Pure semantic re-ranking only measures meaning, but real-world relevance depends
on more than semantics. Factors like recency, source trust, exact keyword matches, and document quality also matter. 
Hybrid (metadata-aware) reranking combines these signals into a weighted score to produce better rankings.

Examples:

A newer document may be better than an older one.

An official source may be better than a random blog.

A document that mentions exact keywords may be more useful.

A short, precise chunk may be better than a long one.

So instead of relying on one score, we combine multiple signals. That’s hybrid / metadata-aware reranking.

Semantic relevance (reranker score), Keyword relevance (exact match), Recency, source trust, popularity.
Final ranking = weighted combination.

## Benefits

RAG reranking bridges the gap between fast retrieval and high accuracy by using query-aware models to ensure the most
relevant context is prioritized for the LLM. By re-ordering initial search results based on deeper reasoning or metadata
like recency and source trust, it significantly reduces noise and improves the quality of the final generated answer.