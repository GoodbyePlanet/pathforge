# Tokenization

Tokenization is the process of converting raw text into a sequence of tokens — the discrete units that language models operate on. Every piece of text you send to a model gets tokenized before processing.

## What Is a Token?

A token is not necessarily a word. Common tokenization schemes (BPE, WordPiece) break text into subword units:

- "unhappiness" → ["un", "happiness"] or ["un", "happy", "ness"]
- "ChatGPT" → ["Chat", "G", "PT"]
- Punctuation, spaces, and special characters often become their own tokens

Roughly: **1 token ≈ 4 characters** in English. A typical paragraph is ~100-150 tokens.

## Why Subword Tokenization?

- **Word-level** tokenization has a huge vocabulary and can't handle unknown words
- **Character-level** tokenization produces very long sequences
- **Subword** tokenization (BPE) balances vocabulary size with sequence length

## Practical Implications

- Token count determines cost (most APIs charge per token) and latency
- Some languages tokenize less efficiently than others — Chinese, Arabic, and code often use more tokens per "word" of meaning
- Understanding tokenization helps you write more token-efficient prompts
- The context-window is measured in tokens, not words or characters

## Tokenizer Libraries

`tiktoken` (OpenAI), `tokenizers` (HuggingFace), and model-specific tokenizers each produce different token splits for the same text.