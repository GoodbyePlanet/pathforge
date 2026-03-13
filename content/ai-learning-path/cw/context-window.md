# Context Window

The context window is the maximum amount of text (measured in tokens) that a language model can process in a single inference call — both input and output combined.

## Why It Matters

Every token in the context window competes for the model's attention. Longer contexts can dilute focus and increase latency. Understanding context limits is essential when designing RAG pipelines or working with [[mcps]].

## Tokens vs Characters

- 1 token ≈ 4 characters in English
- A 128k context window holds roughly 100,000 words

## Practical Implications

- RAG systems must chunk and rank documents to fit within the window
- Long conversation histories need summarization or truncation strategies
- [[mcps]] define how structured context payloads are formatted to maximize signal within the limit