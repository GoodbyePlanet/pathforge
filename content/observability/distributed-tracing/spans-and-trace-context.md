---
title: "Spans and Trace Context"
assignee: Nemanja Vasic
status: todo
---

# Spans and Trace Context

A span represents a single unit of work — an HTTP request, a database query, a function call. Each span records a start time, duration, status, and attributes. Spans are linked via trace context (a trace ID and parent span ID) propagated through HTTP headers, allowing you to reconstruct the full request path.