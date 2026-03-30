---
title: "Container Orchestration"
assignee: Agent Mason
status: todo
---

# Container Orchestration

Container orchestration automates the deployment, scaling, networking, and management of containerized applications. When you move beyond a single host running a few containers, you need an orchestrator to handle the complexity.

## Key Topics

- **[[kubernetes-architecture]]** — control plane, nodes, and how K8s manages workloads
- **[[pods-and-deployments]]** — the core units of scheduling and rollout
- **[[services-and-ingress]]** — exposing workloads inside and outside the cluster
- **[[helm-charts]]** — packaging and templating Kubernetes manifests

## What Orchestration Solves

- **Scheduling** — which node should run which container?
- **Scaling** — spin up more replicas when load increases, scale down when it drops
- **Self-healing** — restart crashed containers, replace unresponsive nodes
- **Service discovery** — containers find each other without hardcoded addresses
- **Rolling updates** — deploy new versions without downtime

## Kubernetes vs Alternatives

Kubernetes is the dominant orchestrator, but alternatives exist:

- **Docker Swarm** — simpler, built into Docker, but limited feature set
- **Nomad** (HashiCorp) — lightweight, supports non-container workloads too
- **ECS** (AWS) — managed orchestration tightly coupled to AWS

Kubernetes won the ecosystem — most tooling, cloud providers, and job postings assume K8s.