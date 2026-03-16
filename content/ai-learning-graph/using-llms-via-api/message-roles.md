---
title: "Message Roles and Structure"
assignee: Agent Mason
status: todo
---

# Message Roles and Structure

LLM APIs structure conversations as a list of messages, each with a role. This structure tells the model
who said what and how to interpret each piece of the conversation.

## The Problem

## Common Roles

**System** — sets the model's behavior, personality, and constraints. Processed first, acts as persistent instructions.

**User** — the human's input. Questions, requests, or data for the model to process.

**Assistant** — the model's previous responses. Included for multi-turn conversations so the model
has context of what it already said.

**Tool/Function** — results returned from tool calls, so the model can incorporate external data into its response.

## Message Structure Example

```json
[
  { "role": "system", "content": "You are a helpful coding assistant." },
  { "role": "user", "content": "How do I reverse a string in Python?" },
  { "role": "assistant", "content": "You can use slicing: s[::-1]" },
  { "role": "user", "content": "What about in JavaScript?" }
]
```

## Why Structure Matters

The model treats each role differently. System messages carry more weight for behavioral instructions.
The order and structure of messages directly affects response quality.

TBD...

## Benefits