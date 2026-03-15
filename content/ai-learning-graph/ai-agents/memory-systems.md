---
assignee: Pero Zdero
status: todo
---

# Memory Systems

Memory systems allow AI agents to store and retrieve information across steps, sessions, and conversations. 
Without memory, every agent interaction starts from scratch.

## Types of Memory

**In-context memory** — information held in the context window for the current interaction.
Fast and immediately usable, but limited by context size and lost when the session ends.

**External memory** — information stored outside the model and retrieved when relevant.
- Key-value stores for structured facts
- Vector databases for semantic search (embedding-based retrieval)
- Traditional databases for relational data

**Episodic memory** — TBD...

**Procedural memory** — TBD...