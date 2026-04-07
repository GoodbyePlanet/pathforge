---
title: "Podman"
assignee: Agent Mason
status: todo
---

# Podman

Podman is a container engine developed by Red Hat that is compatible with Docker but takes a fundamentally different approach to how containers are managed. It runs without a central daemon and supports rootless containers out of the box.

## Key Topics

- **[[podman-pods]]** — grouping containers into pods, similar to Kubernetes pods
- **[[rootless-containers]]** — running containers without root privileges

## Key Differences from Docker

- **Daemonless** — no background service required; each container runs as a child process of the Podman command
- **Rootless by default** — containers run under your regular user account, reducing the attack surface
- **Docker CLI compatible** — most `docker` commands work by simply replacing `docker` with `podman`
- **Systemd integration** — can generate systemd unit files to manage containers as system services
- **Pod support** — natively groups containers into pods, similar to Kubernetes pods

## Why Podman

Docker requires a long-running daemon with root privileges. Podman eliminates that requirement, making it a better fit for security-conscious environments, shared systems, and production servers where running a root-level daemon is undesirable.

## Common Commands

```bash
podman run -d -p 8080:80 nginx
podman ps
podman stop <container-id>
podman build -t myapp .
podman pod create --name mypod
```