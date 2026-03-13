# AI Agents

An AI agent is a system that perceives its environment, makes decisions, and takes actions to achieve goals — often autonomously over multiple steps. Unlike a single model call, agents operate in loops.

## The Agent Loop

1. **Observe** — receive input from the environment (user message, tool result, sensor data)
2. **Think** — reason about what to do next (often using an LLM)
3. **Act** — call a tool, execute code, send a message, or update state
4. **Repeat** until the goal is achieved or a stopping condition is met

## Key Building Blocks

- **[[memory-systems]]** — storing and retrieving information across steps
- **[[planning]]** — decomposing complex goals into executable sub-tasks

## Challenges

**Reliability** — small errors compound over long agent runs. Robust error handling is critical.

**Safety** — agents that can take real-world actions (send emails, run code, modify files) require careful constraint design.

**Evaluation** — measuring agent performance is harder than measuring single-turn model quality.

## Current State

Agents are moving from research demos to production systems. Frameworks like LangGraph, CrewAI, and the Claude Agent SDK provide scaffolding for common patterns.