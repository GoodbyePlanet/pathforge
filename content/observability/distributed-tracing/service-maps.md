---
title: "Service Maps"
assignee: Nemanja Vasic
status: done
---

# Service Maps

Service maps are visual representations of your system's topology.
They are automatically generated diagrams that show how services communicate, derived from trace data.
They reveal dependencies, traffic patterns, and error rates between services.

What they show:
- Dependencies — which services call which, including transitive dependencies
- Traffic flow — request rates between services (e.g., Service A sends 500 req/s to Service B)
- Error rates — percentage of failed requests on each edge, highlighting unhealthy connections
- Latency — p50/p95/p99 response times per edge, making bottlenecks visible at a glance

How they're built:                                                                                                                                                                                       
Tracing backends (Jaeger, Tempo, AWS X-Ray) analyze spans to determine caller/callee relationships, and based on
 relationships, generate service maps.

Why they matter:
- During incidents, they let you quickly see which downstream dependency is failing
- For onboarding, they give new engineers a real-time architecture diagram without stale documentation
- They expose unexpected dependencies (e.g., a frontend service directly calling a database)