---
title: "Structured Logging"
assignee: Nemanja Vasic
status: todo
---

# Structured Logging

Structured logging outputs log entries as key-value pairs (typically JSON) rather than free-form text. This makes logs machine-parseable, searchable, and easy to correlate with traces and metrics.

## Key Topics

- **[[log-correlation]]** — tying logs to traces with correlation IDs
- **[[log-aggregation]]** — centralized logging patterns (ELK, Loki)

## Why Structured

Free-form logs like `"User 123 failed to login"` are easy to read but hard to query at scale. Structured logs like `{"event": "login_failed", "user_id": 123}` let you filter, aggregate, and alert programmatically.