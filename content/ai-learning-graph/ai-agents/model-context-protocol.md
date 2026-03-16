---
title: "Model Context Protocol (MCP)"
assignee: Nemanja Vasic
status: todo
---

# Model Context Protocol (MCP)

MCP is an open standard for connecting AI agents and LLM applications to external tools, data sources,
and services. It provides a standardized way for models to discover and use tools without custom
integration code for each one.

## The Core Idea

Instead of building custom tool integrations for every service, MCP defines a protocol that any tool
provider can implement. An MCP-compatible agent can then connect to any MCP server and use its tools.

## How It Relates to Agents

MCP extends the tool use capability of LLMs by providing a standard
for tool discovery and invocation. AI agents use MCP to connect to external systems dynamically.

TBD...