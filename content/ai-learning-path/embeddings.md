# Embeddings

An embedding is a dense vector representation of data (text, images, audio) in a high-dimensional space. Similar items are placed close together; dissimilar items are placed far apart.

## Why Vectors?

Neural networks operate on numbers. Embeddings translate discrete symbols (words, tokens, documents) into continuous vectors that capture semantic meaning. "king" and "queen" end up nearby in embedding space; "king" and "bicycle" do not.

## Word Embeddings

Early embedding models (Word2Vec, GloVe) learned vectors for individual words from co-occurrence statistics. Famous example:

`vector("king") - vector("man") + vector("woman") ≈ vector("queen")`

## Sentence and Document Embeddings

Modern embedding models (text-embedding-ada, E5, BGE) encode entire sentences or paragraphs into a single vector, capturing meaning at the passage level. These are the foundation of rag pipelines.

## How They're Used

- **Semantic search** — find documents most similar to a query by comparing embedding vectors (cosine similarity, dot product)
- **Clustering** — group semantically related content without labels
- **Classification** — train a lightweight classifier on top of embeddings
- **RAG** — embed documents and queries, retrieve the closest matches

## Vector Databases

Embedding-based retrieval at scale requires a vector database (Pinecone, Weaviate, pgvector) that can perform approximate nearest-neighbor search efficiently across millions of vectors.