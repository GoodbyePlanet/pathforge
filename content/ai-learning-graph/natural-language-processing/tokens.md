---
title: "Tokens"
assignee: Pero Zdero
status: todo
---

# Tokens

Tokens are the fundamental units that language models read and generate. They're not exactly words — a token can be
a word, part of a word, a punctuation mark, or even a space. Understanding tokens is essential because they directly
affect cost, speed, and capability of LLM interactions.

## Why Everyone Is Talking About Tokens

Tokens are the currency of LLMs. You pay per token, your context window is measured in tokens, and the model
processes everything as tokens. Understanding them helps you optimize cost, performance, and prompt design.

## Input vs Output Tokens

**Input tokens** — the tokens in your prompt (system message, user message, examples, context). These are what the
model reads and reasons about.

**Output tokens** — the tokens the model generates in its response. These are typically more expensive than input
tokens because generation requires more computation (autoregressive decoding).

## What Counts as a Token?

- Common words are usually one token: "hello", "the", "computer"
- Longer or rarer words get split: "tokenization" → "token" + "ization"
- Spaces and punctuation are often separate tokens
- Numbers can be surprisingly token-heavy: "123456" may be multiple tokens

## Connection to Tokenization

The tokenization process is what converts raw text into these tokens. Different models use different tokenizers,
so the same text may produce different token counts across models.

TBD...