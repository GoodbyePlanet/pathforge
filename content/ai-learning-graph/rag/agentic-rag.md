---
title: "Agentic RAG"
assignee: Nemanja Vasic
status: done
---

# Agentic RAG

## The problem

Traditional RAG is a "one-shot" process that fails when queries require multiple steps, complex reasoning,
or data from different sources. It often retrieves irrelevant information and lacks the ability to self-correct
or verify its own answers.

## Agentic RAG

Agentic RAG is an autonomous system that uses an LLM as a "reasoning engine" to plan, search, and use tools to solve
a query. While traditional RAG simply fetches data in a linear path where a single search query is matched against a
vector database regardless of whether the result is actually helpful, Agentic RAG iterates by breaking down complex
prompts into several sub-questions and querying different databases and sources as needed to build a complete picture.
This shift from a straight line to a reasoning loop allows the system to adopt its strategy if the first attempt fails
to find the answer. By adding a "reflection" phase, the system evaluates the quality of its own findings,
essentially grading its work and re-searching if the initial results are not enough.

### Agentic RAG components

**The Planning Module**: The part where an agent takes a complex user query and decomposes it into smaller,
manageable sub-tasks or logical steps (e.g., "First search for X, then compare with Y").

**The Multi-Tool Set**: Unlike a traditional RAG system which only talks to a vector database, an agent has a "tools".
This includes access to Web Search, databases, and external APIs to find the most relevant data.

**Reasoning & Execution**: The LLM acts as the central orchestrator that decides which tool to use and when.
It manages the flow, executing the plan and observing the results before moving to the next step.

**Memory Systems**:

- *Short-term*: Tracks the current "thought process" and intermediate search results during a single task.
- *Long-term*: Remembers past user interactions or specific context across different sessions to improve future responses.

**The Reflection Layer**: After gathering data, the agent evaluates its own work. It asks,
"Does this actually answer the user's question?" If the answer is "no" or "incomplete," it triggers a new search
loop to fill the gaps.

### Frameworks

[LangGraph](https://langchain-ai.github.io/langgraph/) - 
[CrewAI](https://docs.crewai.com/)

These are frameworks we can use to manage agent memory, tool-calling, and multi-step reasoning loops.
These frameworks enable the creation of stateful workflows where an agent can "remember" previous attempts and
strategically decide which tool to use next to complete a complex task.

## Benefits

It significantly reduces hallucinations by cross-referencing multiple sources and performing verification of its own
reasoning. This results in higher accuracy when solving complex tasks and the ability to handle real-time,
dynamic data updates.