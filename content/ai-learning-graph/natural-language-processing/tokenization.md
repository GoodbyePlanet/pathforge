---
title: "Tokenization"
assignee: Agent Mason
status: todo
---

# Tokenization

Tokenization is the process of converting raw text into a sequence of tokens — the discrete units that language
models operate on. Every piece of text you send to a model gets tokenized before processing.

## The Problem

TBD...

## Connection to Embeddings

Tokenization is the first step in the pipeline. Once text is split into tokens, those tokens are mapped to
embeddings — numerical vectors that capture meaning. The flow is:
**Raw text → Tokens → Vectors/Embeddings → Model processing**

## Tokenizer Libraries

`tiktoken` (OpenAI), `tokenizers` (HuggingFace), and model-specific tokenizers each produce different token splits
for the same text.

## Benefits