---
title: "Podman Pods"
assignee: Agent Mason
status: todo
---

# Podman Pods

A pod in Podman is a group of containers that share the same network namespace, meaning they communicate over localhost and share the same IP address and port space. This concept is borrowed directly from Kubernetes pods.

## Why Pods

Running related containers in a pod simplifies networking between them. Instead of configuring container-to-container links or custom networks, containers in the same pod just talk to each other on localhost — exactly like processes on the same machine.

## How Pods Work

Every pod has an **infra container** that holds the shared namespaces alive. Application containers join the infra container's network, PID, and IPC namespaces. If the infra container stops, the pod's shared context is gone.

## Common Commands

```bash
# Create a pod
podman pod create --name mypod -p 8080:80

# Run containers inside the pod
podman run -d --pod mypod nginx
podman run -d --pod mypod my-sidecar

# List pods
podman pod ls

# Stop and remove a pod (and all its containers)
podman pod stop mypod
podman pod rm mypod
```

## Pods vs Docker Compose

Docker Compose defines multi-container apps through a YAML file with its own networking model. Podman pods achieve something similar but with shared-namespace isolation — closer to how Kubernetes actually runs workloads. This makes pods a better mental model if you're heading toward Kubernetes.