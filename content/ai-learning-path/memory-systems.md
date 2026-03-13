# Memory Systems

Memory systems allow AI agents to store and retrieve information across steps, sessions, and conversations. Without memory, every agent interaction starts from scratch.

## Types of Memory

**In-context memory** — information held in the context window for the current interaction. Fast and immediately usable, but limited by context size and lost when the session ends.

**External memory** — information stored outside the model and retrieved when relevant.
- Key-value stores for structured facts
- Vector databases for semantic search (embedding-based retrieval)
- Traditional databases for relational data

**Episodic memory** — logs of past interactions. Useful for learning from experience and maintaining continuity across sessions.

**Procedural memory** — stored instructions, workflows, or skills that the agent can execute. Often implemented as system prompts or retrieval-augmented tool-use definitions.

## The Retrieval Problem

Storing information is easy; knowing *what* to retrieve is hard. Effective memory systems use:
- Semantic similarity (RAG) for associative recall
- Recency weighting for time-sensitive information
- Importance scoring to avoid surfacing low-signal memories

## Memory in Planning

Long-horizon planning depends on memory. An agent working on a multi-day task must remember what it has already done, what failed, and what constraints it discovered — without this accumulating in the context window indefinitely.