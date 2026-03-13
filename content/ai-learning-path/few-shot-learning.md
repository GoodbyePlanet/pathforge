# Few-Shot Learning

Few-shot learning (in the context of language models) refers to providing a small number of examples directly in the prompt to guide the model's behavior — without any weight updates or fine-tuning.

## Variants

- **Zero-shot** — no examples; just instructions ("Classify this review as positive or negative.")
- **One-shot** — a single example before the task
- **Few-shot** — typically 2–10 examples before the task

## Why It Works

Language models are pre-trained on vast amounts of text and develop strong pattern-matching abilities. A few examples activate the relevant "program" in the model's learned distribution — it recognizes the task format and generalizes.

## Example Structure

```
Translate English to French.

English: The weather is nice today.
French: Le temps est beau aujourd'hui.

English: I enjoy learning new things.
French:
```

## When to Use It

- When zero-shot instructions produce inconsistent formatting or reasoning
- For tasks that are hard to describe precisely but easy to show
- When you need the model to follow a specific output schema

## Limitations

Few-shot prompting uses context window space. With chain-of-thought reasoning, each example becomes much longer. At some point, fine-tuning on examples is more token-efficient than few-shot prompting.