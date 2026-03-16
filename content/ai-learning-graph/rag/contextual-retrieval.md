---
title: "Contextual Retrieval"
assignee: Nemanja Vasic
status: done
---

# Contextual Retrieval

## The Problem

One of the steps when building a RAG system is to chunk the documents into smaller pieces, then use an embedding model
to convert these smaller pieces (chunks) into vector embeddings, and then storing them into Vector DB.
This is done to improve the efficiency of the retrieval process, but it also comes with a problem:
individual chunks can lose important semantic context.

Small chunks may:

Miss definitions given earlier. Lose references like “this”, “it”, “the above”

Example:

- Chunk A: “OAuth tokens must be validated.”
- Chunk B: “They expire after 15 minutes.”

If chunk B is retrieved on its own, the question becomes: who are “they”? Cookies? Tokens? Credentials in general?

## Contextual Retrieval

Anthropic’s “Contextual Retrieval” is a method designed to improve the accuracy of (RAG) by addressing the loss of
semantic context caused by document chunking. It does this by enriching each chunk with additional context before
retrieval using two techniques:

### How Contextual Retrieval Works

Before embedding, each chunk is enriched with context from the broader document — such as the document title,
section headers, or a brief summary of what the chunk is about. This gives the embedding model more signal
to work with.

### Contextual Embeddings

A language model such as Claude is used to generate a brief, high-level contextual summary for each chunk, capturing
important document-wide information. This generated context is prepended to the chunk text before embedding,
allowing the embedding to retain meaning that would otherwise be lost when chunks are retrieved in isolation.

### Contextual BM25

BM25 (Best Matching 25) is a lexical ranking algorithm that operates on top of an inverted index.
Indexing is a preprocessing step in which text is transformed into data structures that allow fast retrieval
at query time. In Contextual Retrieval, the contextualized chunk text is indexed by traditional search engines
or libraries such as Elasticsearch, Lucene, or Postgres full-text search. At query time, BM25 uses this inverted
index to rank chunks based on exact term matches, improving relevance for keyword-based retrieval.

Anthropic already has prepared a template to use when embedding chunks, and it looks like this:

```html
<document>
    {{WHOLE_DOCUMENT}}
</document>
Here is the chunk we want to situate within the whole document
<chunk>
    {{CHUNK_CONTENT}}
</chunk>
Please give a short succinct context to situate this chunk within the overall document for the purposes of improving
search retrieval of the chunk. Answer only with the succinct context and nothing else.
Anthropic research shows that this method improves the number of failed retrievals by 49%.
```

Resource: https://www.anthropic.com/engineering/contextual-retrieval

## Benefits

- Significantly reduces retrieval errors caused by ambiguous or context-free chunks
- Pairs well with reranking for even better precision
- Relatively simple to implement compared to other retrieval improvements
