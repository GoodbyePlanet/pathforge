---
title: "Metrics"
assignee: Nemanja Vasic
status: todo
---

# Metrics

Metrics are numerical measurements collected over time that describe the behavior of a system. They are lightweight, aggregatable, and ideal for alerting and dashboards.

## Key Topics

- **[[metric-types]]** — counters, gauges, and histograms

## Core Idea

Unlike logs and traces which capture individual events, metrics capture aggregates — request rate, error percentage, latency percentiles. This makes them efficient to store and fast to query, even at massive scale.