---
title: "Pods and Deployments"
assignee: Agent Mason
status: todo
---

# Pods and Deployments

Pods and Deployments are the core building blocks for running workloads in Kubernetes.

## Pods

A Pod is the smallest deployable unit in Kubernetes — a wrapper around one or more containers that share networking and storage.

- Every container in a pod shares the same IP address and port space
- Containers in a pod can communicate via `localhost`
- Pods are ephemeral — they can be killed and rescheduled at any time
- You rarely create pods directly; you use higher-level controllers

## Deployments

A Deployment manages a set of identical pods (a ReplicaSet) and handles rolling updates and rollbacks.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: myapp:1.2.0
          ports:
            - containerPort: 3000
```

## Key Features

- **Replica management** — ensures the specified number of pods are always running
- **Rolling updates** — gradually replaces old pods with new ones during a deploy
- **Rollback** — revert to a previous version with `kubectl rollout undo`
- **Self-healing** — automatically replaces crashed or evicted pods

## Other Workload Types

- **StatefulSet** — for stateful apps (databases) that need stable network identity and persistent storage
- **DaemonSet** — runs one pod per node (log collectors, monitoring agents)
- **Job / CronJob** — one-off or scheduled batch tasks