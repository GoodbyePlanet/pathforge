---
title: "Context Rot"
assignee: Pero Zdero
status: todo
---

# Context Rot

Context rot refers to the degradation of model performance as the context window fills up with
outdated, irrelevant, or conflicting information over the course of a long interaction.

## The Problem

## Why It Happens

- Earlier parts of the conversation may contradict later corrections
- Irrelevant information competes for the model's attention
- The model may lose track of what's current vs outdated in a long context
- Noise accumulates, reducing the signal-to-noise ratio

## How to Mitigate It

- Summarize and compress conversation history periodically
- Use context engineering to control what the model sees
- Leverage external memory systems instead of relying solely on context
- Start fresh conversations for new topics

TBD...

## Benefits