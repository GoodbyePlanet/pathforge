# Retrieval-Augmented Generation (RAG)

RAG is a technique that enhances LLM responses by retrieving relevant documents from an external knowledge base before generating an answer.

## How It Works

1. A user query is embedded into a vector representation.
2. Similar documents are retrieved from a vector store.
3. The retrieved documents are injected into the [[context-window]] alongside the query.
4. The LLM generates a response grounded in the retrieved context.

## Why RAG?

Without RAG, LLMs rely entirely on knowledge encoded during training. RAG allows models to access up-to-date or domain-specific information without retraining.

## Related Topics

- [[context-window]] — understanding how much context a model can process at once is critical for RAG pipelines
- [[mcps]] — model context protocols can standardize how context is structured and passed to models