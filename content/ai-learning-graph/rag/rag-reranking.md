---
assignee: Pero Zdero
status: in-progress
---

# RAG Reranking

Reranking is a second-pass step in a RAG pipeline that re-scores retrieved documents
to improve relevance before they're sent to the LLM.

## Why Reranking Matters

Initial retrieval (e.g., vector similarity search) is fast but imprecise. A reranker uses a more
powerful model to evaluate how well each retrieved chunk actually answers the query, promoting
the most relevant results to the top.

## How It Works

1. Retrieve top-K candidates using fast search (embeddings / BM25)
2. Pass each candidate + the query through a reranking model
3. Re-sort by the reranker's relevance score
4. Send the top-N reranked results to the LLM

## Common Reranking Approaches

- **Cross-encoder models** — score query-document pairs jointly (e.g., Cohere Rerank, BGE Reranker)
- **LLM-based reranking** — use an LLM to judge relevance
- **Reciprocal Rank Fusion (RRF)** — combine rankings from multiple retrievers

TBD...