---
title: "LLM Tools and Functions"
assignee: Pero Zdero
status: todo
---

# LLM Tools and Functions

Tool use (also called function calling) allows an LLM to invoke external functions or APIs as part of
generating a response. Instead of just producing text, the model can take actions in the real world.

## The Problem

## How It Works

1. **Define tools** — you provide the model with a list of available tools, each with a name,
   description, and parameter schema (JSON Schema)
2. **Model decides** — based on the conversation, the model decides whether to call a tool
3. **Tool call** — the model outputs a structured tool call (function name + arguments) instead of text
4. **Execute** — your application executes the function and returns the result
5. **Continue** — the model receives the result and generates a final response

## Tool Definition Example

```json
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "parameters": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "description": "City name" }
    },
    "required": ["location"]
  }
}
```

## Why Tools Matter

Tools transform LLMs from text generators into agents that can:
- Query databases and APIs
- Perform calculations
- Read and write files
- Interact with external systems

This is a key building block for AI agents.

TBD...

## Benefits