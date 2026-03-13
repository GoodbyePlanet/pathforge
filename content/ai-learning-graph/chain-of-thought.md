---
assignee: John Doe
---

# Chain of Thought

Chain-of-thought (CoT) prompting asks a language model to show its reasoning step-by-step before producing a final answer. This simple technique dramatically improves performance on reasoning-heavy tasks.

## The Core Idea

Instead of asking: *"What is 17 × 24?"*

Ask: *"What is 17 × 24? Think step by step."*

The model then reasons through the problem explicitly:
> 17 × 24 = 17 × 20 + 17 × 4 = 340 + 68 = 408

Generating intermediate steps forces the model to allocate more computation to the problem and creates a "scratchpad" for multi-step reasoning.

## Variants

**Zero-shot CoT** — just add "Think step by step" to the prompt. Surprisingly effective.

**Few-shot CoT** — provide few-shot examples where each solution includes the reasoning chain.

**Self-consistency** — sample multiple reasoning chains and take the majority answer.

**Tree of Thoughts** — explore branching reasoning paths and evaluate which are most promising.

## When It Helps

- Math and logic problems
- Multi-step planning
- Code debugging and generation
- Tasks requiring causal reasoning

## When It Doesn't Help

Simple classification or retrieval tasks don't benefit from CoT — the overhead adds cost and latency without accuracy gains. Match the technique to the task complexity.