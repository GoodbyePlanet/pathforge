---
assignee: John Doe
---

# AI Agents

An AI Agent is application that calls LLM in a loop until it reaches termination criteria.

## The Agent Loop

1. **Observe** — receive input from the environment (user message, tool result, sensor data)
2. **Think** — reason about what to do next (often using an LLM)
3. **Act** — call a tool, execute code, send a message, or update state
4. **Repeat** until the goal is achieved or a stopping condition is met

## Key Building Blocks

- **[[memory-systems]]** — storing and retrieving information across steps
- **[[model-context-protocol]]** — MCPs: a standard for connecting agents to external tools and data
- **[[human-in-the-loop]]** — keeping humans involved in agent decision-making
- **[[google-adk]]** — Google's Agent Development Kit for building AI agents
- **[[agent-learning]]** — teaching agents to learn from experience
- **[[skills-and-agents-files]]** — Skills.md and Agents.md: open formats for guiding agents

TBD...