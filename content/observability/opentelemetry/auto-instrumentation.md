---
title: "Auto-Instrumentation"
assignee: Nemanja Vasic
status: done
---

# Auto-Instrumentation

[Auto-Instrumentation](https://opentelemetry.io/docs/concepts/instrumentation/zero-code/)
provides agents and hooks that automatically instrument common frameworks, HTTP clients, database drivers,
and messaging libraries — giving us baseline observability out of the box.
This means that requests and responses, database calls, message queue calls, and so forth are what are instrumented.
Application code, however, is not typically instrumented. To instrument our application code we need to use
[code based instrumentation](https://opentelemetry.io/docs/concepts/instrumentation/code-based/).

