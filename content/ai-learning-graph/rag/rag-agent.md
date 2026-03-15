---
assignee: Pero Zdero
status: todo
---

# RAG Agent

A RAG Agent combines RAG retrieval with agentic behavior — the agent decides
when and what to retrieve, can refine queries, and iterates until it has enough information to answer.

## How It Differs from Basic RAG

In basic RAG, retrieval happens once. A RAG agent can:
- Decide whether retrieval is needed at all
- Formulate and reformulate search queries
- Retrieve from multiple sources
- Evaluate whether retrieved results are sufficient
- Perform follow-up retrievals based on initial findings

## Resources

- Google ADK RAG Agent example: https://github.com/google/adk-samples/tree/main/python/agents/RAG

TBD...