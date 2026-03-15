---
assignee: Pero Zdero
status: todo
---

# LLM Parameters — Temperature and Top-P

When calling an LLM via API, you can control the randomness and creativity of the output
using sampling parameters. The two most important are temperature and top-p.

## Temperature

Controls randomness. Ranges from 0 to 2 (typically).

- **0** — deterministic, always picks the most likely token. Best for factual/consistent outputs.
- **0.1–0.5** — low randomness. Good for code, data extraction, structured tasks.
- **0.7–1.0** — moderate randomness. Good for general conversation, writing.
- **1.0+** — high randomness. More creative but less reliable.

## Top-P (Nucleus Sampling)

Instead of considering all possible tokens, top-p limits the selection to the smallest set of tokens
whose cumulative probability exceeds P.

- **top_p = 0.1** — only considers tokens in the top 10% probability mass (very focused)
- **top_p = 0.9** — considers tokens covering 90% probability mass (more diverse)

## Temperature vs Top-P

Both control output diversity but work differently. Generally, adjust one and leave the other at default.
Using both aggressively can produce unpredictable results.

## Other Common Parameters

- **max_tokens** — cap on response length
- **stop sequences** — strings that halt generation
- **frequency_penalty / presence_penalty** — reduce repetition

TBD...